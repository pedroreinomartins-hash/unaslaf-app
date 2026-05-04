import { buildContextString, findRelevantDocs } from './context-static.js';

// Cache do contexto completo (construído uma vez)
let _fullContext = null;
function getFullContext() {
  if (!_fullContext) _fullContext = buildContextString();
  return _fullContext;
}

// Palavras que disparam busca web (notícias recentes)
const BUSCA_WEB_REGEX = /notícia|noticia|recente|último|ultima|hoje|esta semana|atualiz|novidade/i;

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
  return data.output
    ?.filter(o => o.type === 'message')
    ?.flatMap(o => o.content || [])
    ?.filter(c => c.type === 'output_text')
    ?.map(c => c.text)
    ?.join('') || null;
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

  const { messages, system, userName, userCpf } = req.body;
  const lastMsg = messages?.[messages.length - 1]?.content || '';

    // Detecta se é pergunta sobre todas as ações coletivas
  const isListaAcoes = /todas.*ações|ações coletivas|lista.*ações|quais.*ações|ações.*unaslaf|ações.*patrocinadas/i.test(lastMsg);

  let relevantContext;
  if (isListaAcoes) {
    // Retorna TODOS os documentos — índice + todas as 15 ações
    relevantContext = getFullContext();
  } else {
    // RAG normal: busca os documentos mais relevantes
    const relevantDocs = findRelevantDocs(lastMsg, 10);
    relevantContext = relevantDocs.length > 0
      ? relevantDocs.map(d => `===== ${d.title.toUpperCase()} =====\n${d.content}`).join('\n\n')
      : getFullContext().slice(0, 40000);
  }

  const systemFull = `${system || ''}

DADOS DO ASSOCIADO AUTENTICADO:
- Nome: ${userName || 'não informado'}
- CPF: ${userCpf || 'não informado'}

========================================
BASE DE CONHECIMENTO UNASLAF (FONTE PRIMÁRIA — USE PARA RESPONDER):
========================================
${relevantContext}
========================================

INSTRUÇÃO CRÍTICA: Use PRIORITARIAMENTE os documentos acima para responder.
- Quando perguntado sobre ações coletivas, liste TODAS as ações presentes nos documentos acima com número do processo e status — não resuma nem omita nenhuma.
- Quando o associado perguntar se está em alguma lista, verifique o CPF/nome nos documentos de portarias.
- Mantenha linguagem clara, cordial e institucional.`;

  const openaiMessages = [
    { role: 'system', content: systemFull },
    ...messages,
  ];

  try {
    let text = '';
    if (BUSCA_WEB_REGEX.test(lastMsg)) {
      console.log('Busca web ativada');
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
