// =============================================================================
// auth.js — Gera token JWT após validação local do código no frontend
// =============================================================================
// O código de 6 dígitos é validado no frontend (como era antes).
// Este endpoint recebe o CPF + código + hash de validação e emite o JWT.
// Não depende de memória compartilhada entre instâncias serverless.
// =============================================================================

import { checkRateLimit, gerarToken, validarHmacCodigo } from '../lib/_security.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit: 10 tentativas por minuto por IP
  const rl = checkRateLimit(req, 'auth');
  if (rl.blocked) return res.status(429).json({ error: rl.message });

  const { cpf, code, hmac, nome } = req.body;
  if (!cpf || !code || !hmac) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  const cpfClean = cpf.replace(/\D/g, '');

  // Valida o HMAC: garante que o código foi gerado pelo nosso servidor
  const valido = validarHmacCodigo(cpfClean, code, hmac);
  if (!valido) {
    return res.status(401).json({ error: 'Código inválido ou expirado.' });
  }

  // Emite token JWT de sessão
  const token = gerarToken(cpfClean, nome || '');
  console.log(`Auth OK: CPF ${cpfClean.slice(0, 3)}***`);
  return res.status(200).json({ token, nome });
}
