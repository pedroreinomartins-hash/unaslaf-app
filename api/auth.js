// =============================================================================
// auth.js — Endpoint de autenticação: valida o código e gera token de sessão
// =============================================================================
// Chamado pelo frontend após o associado digitar o código de 6 dígitos.
// Se o código estiver correto, retorna um JWT que será usado nas demais chamadas.
// =============================================================================

import { checkRateLimit, gerarToken } from './_security.js';

// Armazena códigos pendentes: { cpf: { code, nome, cpf, exp } }
const codigosPendentes = new Map();

// ── Registrar código enviado (chamado internamente após envio do WhatsApp) ──
export function registrarCodigo(cpf, code, nome) {
  codigosPendentes.set(cpf, {
    code,
    nome,
    cpf,
    exp: Date.now() + 10 * 60 * 1000, // 10 minutos
  });
}

// ── Limpeza periódica de códigos expirados ──────────────────────────────────
setInterval(() => {
  const now = Date.now();
  for (const [cpf, entry] of codigosPendentes.entries()) {
    if (now > entry.exp) codigosPendentes.delete(cpf);
  }
}, 60_000);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit: 10 tentativas por minuto por IP
  const rl = checkRateLimit(req, 'sheet');
  if (rl.blocked) return res.status(429).json({ error: rl.message });

  const { cpf, code } = req.body;
  if (!cpf || !code) return res.status(400).json({ error: 'CPF e código obrigatórios' });

  const cpfClean = cpf.replace(/\D/g, '');
  const entry    = codigosPendentes.get(cpfClean);

  if (!entry) {
    return res.status(401).json({ error: 'Código expirado ou CPF não encontrado. Tente novamente.' });
  }

  if (Date.now() > entry.exp) {
    codigosPendentes.delete(cpfClean);
    return res.status(401).json({ error: 'Código expirado. Solicite um novo.' });
  }

  if (entry.code !== String(code).trim()) {
    return res.status(401).json({ error: 'Código incorreto.' });
  }

  // Código correto — gera token de sessão
  codigosPendentes.delete(cpfClean);
  const token = gerarToken(cpfClean, entry.nome);

  console.log(`Auth OK: CPF ${cpfClean.slice(0, 3)}***`);
  return res.status(200).json({ token, nome: entry.nome });
}
