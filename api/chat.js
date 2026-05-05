import { DOCS } from './context-static.js';

// ── Cache do Drive (10 minutos) ──────────────────────────────
let driveCache = { text: '', ts: 0 };
const DRIVE_CACHE_TTL = 10 * 60 * 1000;

async function getDriveContext(baseUrl) {
  const now = Date.now();
  if (driveCache.text && (now - driveCache.ts) < DRIVE_CACHE_TTL) {
    return driveCache.text;
  }
  try {
    const res = await fetch(`${baseUrl}/api/context`);
    if (!res.ok) return '';
    const data = await res.json();
    driveCache = { text: data.context || '', ts: now };
    console.log(`Drive context: ${data.filesRead} arquivos, ${driveCache.text.length} chars`);
    return driveCache.text;
  } catch (e) {
    console.warn('Drive context erro:', e.message);
    return '';
  }
}

// ── Índice resumido — enviado em TODAS as perguntas (~500 tokens) ──
// Gerado uma vez a partir dos documentos estáticos
let _indice = null;
function getIndice() {
  if (_indice) return _indice;
  // Monta índice com título, categoria e primeiras 200 chars do conteúdo
  _indice = DOCS.map(d => {
    const resumo = d.content.split('\n')
      .filter(l => l.trim())
      .slice(0, 3)
      .join(' ')
      .slice(0, 200);
    return `[${d.id}] ${d.title} | ${d.category} | ${resumo}...`;
  }).join('\n');
  return _indice;
}

// ── Detectores de intenção ──────────────────────────────────────
const REGEX = {
  listaAcoes:    /quais.*ações|todas.*ações|ações coletivas|lista.*ações|ações.*unaslaf|ações.*patrocinadas|processos.*unaslaf/i,
  detalhesAcao:  /ação\s*\d+|adicional.*fronteira|jornada|abono.*ponto|geap|mp\s*873|auxílio.*transporte|covid|pasep|abono.*permanência|paridade|reposição.*erário|licença.*prêmio|irpf.*creche|quota.*creche|dobra.*teto|fronteira/i,
  adi4151:       /adi\s*4151|adi4151|4151/i,
  portaria:      /portaria|enquadramento|analista.*tributário|siape|redistribuído/i,
  estatuto:      /estatuto|filiação|desfiliação|associado|mensalidade|sanção|penalidade|conselho/i,
  regimento:     /regimento|eleição|delegado|chapa|votação|impugnação|assembleia/i,
  lista28:       /28%|lista.*associado|ação.*28|ação dos 28/i,
  processos:     /tabela.*processo|todos.*processos|lista.*processo|processos.*unaslaf|escritório.*mota|malinverni|pecfaz|nomenclatura|28,86|reajuste.*28|execução.*sentença.*rs/i,
  buscaWeb:      /notícia|noticia|recente|último|ultima|hoje|esta semana|novidade/i,
};

// ── Seleciona documentos relevantes por intenção ─────────────────
function selectContext(msg) {
  const m = msg.toLowerCase();

  // Lista completa de ações → índice + todos os docs de ação
  if (REGEX.listaAcoes.test(m)) {
    const acoes = DOCS.filter(d => d.category === 'acoes_coletivas' || d.category === 'relatorio_acoes_indice');
    return acoes.map(d => `===== ${d.title.toUpperCase()} =====\n${d.content}`).join('\n\n');
  }

  // ADI 4151
  if (REGEX.adi4151.test(m)) {
    return getDoc('adi_4151');
  }

  // Portarias / enquadramento / SIAPE
  if (REGEX.portaria.test(m)) {
    return getDoc('portaria_7243') + '\n\n' + getDoc('portaria_9546');
  }

  // Estatuto
  if (REGEX.estatuto.test(m)) {
    return getDoc('estatuto');
  }

  // Regimento eleitoral
  if (REGEX.regimento.test(m)) {
    return getDoc('regimento');
  }

  // Lista 28%
  if (REGEX.lista28.test(m)) {
    return getDoc('lista_28_pt1') + '\n\n' + getDoc('lista_28_pt2');
  }

  // Tabela completa de processos
  if (REGEX.processos.test(m)) {
    return getDoc('processos_completo');
  }

  // Ação específica — detecta por palavras-chave
  if (REGEX.detalhesAcao.test(m)) {
    const map = {
      'fronteira':       'acao_01',
      'jornada':         'acao_02',
      'abono.*ponto':    'acao_02',
      'geap':            'acao_03',
      'mp.*873':         'acao_04',
      'transporte.*coletiva': 'acao_05',
      'transporte.*grupo':    'acao_06',
      'covid':           'acao_07',
      'pasep':           'acao_08',
      'abono.*permanência':   'acao_09',
      'paridade':        'acao_10',
      'reposição.*erário':    'acao_11',
      'licença.*prêmio': 'acao_12',
      'irpf.*creche':    'acao_13',
      'quota.*creche':   'acao_14',
      'dobra.*teto':     'acao_15',
    };
    for (const [pattern, id] of Object.entries(map)) {
      if (new RegExp(pattern, 'i').test(m)) {
        return getDoc(id);
      }
    }
    // Ação por número
    const numMatch = m.match(/ação\s*(\d+)/i);
    if (numMatch) {
      const id = `acao_${String(numMatch[1]).padStart(2, '0')}`;
      const doc = DOCS.find(d => d.id === id);
      if (doc) return `===== ${doc.title.toUpperCase()} =====\n${doc.content}`;
    }
  }

  // Padrão: envia o índice (~500 tokens) — resposta genérica institucional
  return `ÍNDICE DOS DOCUMENTOS DISPONÍVEIS:\n${getIndice()}\n\nINSTRUÇÃO: Se o associado pedir detalhes sobre um tema específico, indique que pode fornecer mais informações sobre qualquer item do índice acima.`;
}

function getDoc(id) {
  const doc = DOCS.find(d => d.id === id);
  if (!doc) return '';
  return `===== ${doc.title.toUpperCase()} =====\n${doc.content}`;
}

// ── OpenAI ───────────────────────────────────────────────────────
async function searchAndAnswer(msgs) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: 'gpt-4.1-mini', tools: [{ type: 'web_search_preview' }], tool_choice: 'auto', input: msgs }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.output?.filter(o => o.type === 'message')?.flatMap(o => o.content || [])?.filter(c => c.type === 'output_text')?.map(c => c.text)?.join('') || null;
}

async function standardAnswer(msgs) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: 'gpt-4.1-mini', max_tokens: 2000, messages: msgs }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI error');
  return data.choices?.[0]?.message?.content || '';
}

// ── Handler ──────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, system, userName, userCpf, baseUrl } = req.body;
  const lastMsg = messages?.[messages.length - 1]?.content || '';

  // Camada 1 — Contexto estático (instantâneo)
  const staticContext = selectContext(lastMsg);

  // Camada 2 — Contexto do Drive (dinâmico, sem necessidade de redeploy)
  const driveContext = baseUrl ? await getDriveContext(baseUrl) : '';

  // Combina: estático tem prioridade, Drive complementa com atualizações
  const context = driveContext
    ? `${staticContext}\n\n========================================\nATUALIZAÇÕES RECENTES (documentos do Drive):\n========================================\n${driveContext.slice(0, 8000)}`
    : staticContext;

  const systemFull = `${system || ''}

DADOS DO ASSOCIADO AUTENTICADO:
- Nome: ${userName || 'não informado'}
- CPF: ${userCpf || 'não informado'}

========================================
BASE DE CONHECIMENTO UNASLAF:
========================================
${context}
========================================

Responda em português brasileiro, linguagem clara e cordial. Use APENAS as informações acima. Se não tiver os detalhes solicitados, informe que pode pesquisar mais sobre o tema se o associado detalhar a dúvida.`;

  const openaiMessages = [{ role: 'system', content: systemFull }, ...messages];

  try {
    let text = '';
    if (REGEX.buscaWeb.test(lastMsg)) {
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
