// Palavras-chave que indicam consulta processual
const PROCESSUAL_REGEX = /process|ação coletiva|causa|trf|cnj|stj|stf|lista|nome.*process|process.*nome|advogad|juiz|sentença|decisão|recurso|mandado|liminar|tutela|execução|penhora|audiência|julgamento|habeas|impetrar|petição|contestação|agravo|apelação|embargo|precatório|rpv|cumprimento de sentença/i;

// Cache simples do contexto do Drive (5 minutos)
let contextCache = { text: '', ts: 0 };
const CACHE_TTL  = 5 * 60 * 1000;

async function getDriveContext(baseUrl) {
  const now = Date.now();
  if (contextCache.text && (now - contextCache.ts) < CACHE_TTL) {
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
      max_tokens: 1500,
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

  // Carrega contexto dos documentos do Drive
  const driveContext = baseUrl ? await getDriveContext(baseUrl) : '';

  // Monta system prompt completo
  const systemFull = `${system || ''}

DADOS DO ASSOCIADO AUTENTICADO:
- Nome: ${userName || 'não informado'}
- CPF: ${userCpf || 'não informado'}

${driveContext ? `DOCUMENTOS E ARQUIVOS DE CONTEXTO DA UNASLAF (use para responder perguntas específicas):
${driveContext}` : ''}

INSTRUÇÕES PARA CONSULTA PROCESSUAL:
Quando perguntado sobre processos, listas ou ações judiciais:
1. Primeiro verifique nos documentos de contexto acima se o nome ou CPF do associado aparece
2. Analise se o perfil se encaixa nas ações coletivas da UNASLAF descritas
3. Oriente como verificar pessoalmente em https://processual.trf1.jus.br e https://datajud-wiki.cnj.jus.br
4. Seja específico e objetivo na resposta`;

  const openaiMessages = [
    { role: 'system', content: systemFull },
    ...messages,
  ];

  try {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const isProcessual = PROCESSUAL_REGEX.test(lastMsg);

    let text = '';

    if (isProcessual) {
      console.log('Modo processual + Drive ativado');
      text = await searchAndAnswer(openaiMessages);
      if (!text) text = await standardAnswer(openaiMessages);
    } else {
      text = await standardAnswer(openaiMessages);
    }

    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
