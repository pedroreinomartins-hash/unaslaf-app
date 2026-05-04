// Cache do contexto do Drive (10 minutos)
let contextCache = { text: '', ts: 0 };
const CACHE_TTL  = 10 * 60 * 1000;

// Palavras que disparam busca web adicional
const BUSCA_WEB_REGEX = /notícia|noticia|recente|último|ultima|hoje|esta semana|novo|nova|atualiz/i;

async function getDriveContext(baseUrl) {
  const now = Date.now();
  if (contextCache.text && (now - contextCache.ts) < CACHE_TTL) {
    console.log('Contexto Drive: usando cache');
    return contextCache.text;
  }
  try {
    const res = await fetch(`${baseUrl}/api/context`);
    if (!res.ok) return '';
    const data = await res.json();
    contextCache = { text: data.context || '', ts: now };
    console.log(`Contexto Drive carregado: ${data.filesRead} arquivos, ${contextCache.text.length} chars`);
    return contextCache.text;
  } catch (e) {
    console.warn('Erro ao carregar contexto Drive:', e.message);
    return '';
  }
}

async function searchAndAnswer(openaiMessages) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      tools: [{ type: 'web_search_preview' }],
      tool_choice: 'auto',
      input: openaiMessages,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data.output
    ?.filter(o => o.type === 'message')
    ?.flatMap(o => o.content || [])
    ?.filter(c => c.type === 'output_text')
    ?.map(c => c.text)
    ?.join('') || '';
  return text || null;
}

async function standardAnswer(openaiMessages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: openaiMessages,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI error');
  return data.choices?.[0]?.message?.content || '';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, system, userName, userCpf, baseUrl } = req.body;

  // Carrega contexto do Drive SEMPRE — é a base de conhecimento principal
  const driveContext = baseUrl ? await getDriveContext(baseUrl) : '';

  // Limita o contexto do Drive a 20k chars para não estourar o token limit
  // Prioriza o início do arquivo (onde estão as regras e ações coletivas)
  const driveContextLimited = driveContext.length > 20000
    ? driveContext.slice(0, 20000) + '\n\n[... contexto truncado por limite de tamanho ...]'
    : driveContext;

  const systemFull = `${system || ''}

DADOS DO ASSOCIADO AUTENTICADO NESTA SESSÃO:
- Nome: ${userName || 'não informado'}
- CPF: ${userCpf || 'não informado'}

${driveContextLimited ? `========================================
BASE DE CONHECIMENTO UNASLAF (FONTE PRIMÁRIA):
Use PRIORITARIAMENTE estas informações para responder. Elas vêm dos documentos oficiais da UNASLAF.
========================================
${driveContextLimited}
========================================` : ''}

INSTRUÇÕES GERAIS:
1. Use SEMPRE a base de conhecimento acima como fonte principal de respostas
2. Quando perguntar sobre ações coletivas, liste TODAS as ações mencionadas nos documentos acima
3. Quando o associado perguntar se está em alguma lista, verifique o CPF/nome nos documentos
4. Para perguntas sobre processos judiciais, inclua sempre o aviso obrigatório de orientação não oficial
5. Responda em português brasileiro, linguagem clara e acolhedora`;

  const openaiMessages = [
    { role: 'system', content: systemFull },
    ...messages,
  ];

  try {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const precisaBuscaWeb = BUSCA_WEB_REGEX.test(lastMsg);

    let text = '';

    if (precisaBuscaWeb) {
      console.log('Busca web ativada para:', lastMsg.slice(0, 60));
      text = await searchAndAnswer(openaiMessages);
      if (!text) text = await standardAnswer(openaiMessages);
    } else {
      // Usa contexto do Drive + conhecimento base (sem busca web desnecessária)
      text = await standardAnswer(openaiMessages);
    }

    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
