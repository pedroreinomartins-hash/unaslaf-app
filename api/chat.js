// api/chat.js — Chat de IA com OpenAI GPT-4o-mini + RAG (context-static.js)

const OpenAI = require('openai');
const { selectContext } = require('./context-static');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { message, history, associate } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Mensagem não informada' });

    // Seleciona contexto relevante via RAG
    const docs    = selectContext(message);
    const context = docs.map(d => `=== ${d.title} ===\n${d.content}`).join('\n\n');

    // System prompt com identidade + contexto selecionado + dados do associado
    const associateName  = associate?.nome  || 'associado';
    const associateCPF   = associate?.cpf   || '';
    const associateSIAPE = associate?.siape || '';

    const systemFull = `Você é o Atendente Virtual oficial da UNASLAF — União Nacional dos Servidores do LAFE.
CNPJ: 73.369.795/0001-83 | Sede: SCN-Qd.6-Bloco A, Ed. Venâncio 3000, 4º andar, salas 413/414, Brasília-DF
Site: https://unaslaf.org.br

ASSOCIADO AUTENTICADO:
- Nome: ${associateName}
- CPF: ${associateCPF}
- SIAPE: ${associateSIAPE}
- Cargo: ${associate?.cargo || ''}
- Situação: ${associate?.situacao || ''}

REGRAS OBRIGATÓRIAS:
1. Responda SEMPRE em português do Brasil, tom cordial e institucional.
2. NÃO prometa pagamento, prazo, implantação ou vitória judicial.
3. Para ADI 4151: distinga Analista x Técnico, ativo x aposentado x pensionista.
4. Para ações coletivas: informe que dados são de julho/2023 e recomende confirmação oficial.
5. NÃO divulgue lista completa de associados.
6. Para orientação jurídica definitiva, encaminhe ao jurídico da UNASLAF.
7. Em caso de conflito entre documentos, priorize a informação mais recente.
8. Sempre indique a origem da informação quando relevante.
9. Finalize respostas sobre direitos individuais com: "Para confirmação do seu caso específico, consulte o jurídico da UNASLAF."

BASE DE CONHECIMENTO (documentos selecionados para esta pergunta):
${context}

AVISO OBRIGATÓRIO: Suas respostas têm caráter orientativo e não oficial. Lembre o associado quando necessário.`;

    // Monta histórico de conversa
    const messages = [{ role: 'system', content: systemFull }];

    if (Array.isArray(history)) {
      for (const h of history.slice(-10)) { // últimas 10 mensagens
        if (h.role && h.content) {
          messages.push({ role: h.role, content: h.content });
        }
      }
    }

    messages.push({ role: 'user', content: message });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.3,
    });

    const reply = completion.choices[0]?.message?.content || 'Não foi possível gerar resposta.';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('[chat] Erro:', err);
    return res.status(500).json({ error: 'Erro ao processar mensagem', detail: err.message });
  }
};
