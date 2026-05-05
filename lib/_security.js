// =============================================================================
// _security.js — Funções de segurança compartilhadas
// =============================================================================
// Contém:
//   - Rate limiting por IP
//   - HMAC de código: assina o código de verificação com chave secreta
//     (resolve o problema de memória compartilhada entre instâncias serverless)
//   - JWT: gera e valida tokens de sessão
// =============================================================================

import { createHmac } from 'crypto';

// ── Configurações de Rate Limiting ──────────────────────────────────────────
const RATE_LIMITS = {
  auth:      { max: 10,  window: 60_000  }, // validação código: 10/min
  sheet:     { max: 10,  window: 60_000  }, // login: 10/min
  whatsapp:  { max: 5,   window: 60_000  }, // envio código: 5/min
  chat:      { max: 40,  window: 60_000  }, // chat: 40/min
  cadastro:  { max: 10,  window: 60_000  }, // cadastro: 10/min
  default:   { max: 60,  window: 60_000  },
};

// ── Configurações de JWT ─────────────────────────────────────────────────────
const JWT_EXPIRY       = 4 * 60 * 60 * 1000; // 4 horas
const HMAC_CODE_EXPIRY = 10 * 60;             // 10 minutos em segundos

// ── Segredo base ─────────────────────────────────────────────────────────────
function getSecret() {
  return process.env.OPENAI_API_KEY?.slice(-32) || 'unaslaf-secret-2026';
}

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const rateLimitStore = new Map();

export function checkRateLimit(req, endpoint = 'default') {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
           || req.headers['x-real-ip']
           || req.socket?.remoteAddress
           || 'unknown';

  const key   = `${endpoint}:${ip}`;
  const limit = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const now   = Date.now();
  const entry = rateLimitStore.get(key) || { count: 0, start: now };

  if (now - entry.start > limit.window) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  if (entry.count > limit.max) {
    const resetIn = Math.ceil((limit.window - (now - entry.start)) / 1000);
    return { blocked: true, message: `Muitas tentativas. Aguarde ${resetIn} segundos.`, resetIn };
  }
  return { blocked: false };
}

// Limpeza periódica
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    const endpoint = key.split(':')[0];
    const limit    = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
    if (now - entry.start > limit.window * 2) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);


// ── HMAC do Código de Verificação ────────────────────────────────────────────
// Funciona assim:
//   1. Servidor gera o código e assina: HMAC(cpf + código + janela_de_tempo)
//   2. Frontend recebe o código + hmac e os armazena
//   3. Na validação, o servidor recalcula o HMAC e compara
//   Não precisa de memória compartilhada — a assinatura carrega a prova de autenticidade.

export function gerarHmacCodigo(cpf, code) {
  // Janela de tempo: muda a cada HMAC_CODE_EXPIRY segundos
  const janela = Math.floor(Date.now() / 1000 / HMAC_CODE_EXPIRY);
  const msg    = `${cpf}:${code}:${janela}`;
  return createHmac('sha256', getSecret()).update(msg).digest('hex');
}

export function validarHmacCodigo(cpf, code, hmac) {
  // Testa a janela atual e a anterior (tolerância de até 20 min)
  const janelaAtual   = Math.floor(Date.now() / 1000 / HMAC_CODE_EXPIRY);
  const janelaAnterior = janelaAtual - 1;

  for (const janela of [janelaAtual, janelaAnterior]) {
    const msg      = `${cpf}:${code}:${janela}`;
    const expected = createHmac('sha256', getSecret()).update(msg).digest('hex');
    if (expected === hmac) return true;
  }
  return false;
}


// ── JWT ──────────────────────────────────────────────────────────────────────
function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function gerarToken(cpf, nome) {
  const header  = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    cpf, nome,
    iat: Date.now(),
    exp: Date.now() + JWT_EXPIRY,
  }));
  const sig = base64url(
    createHmac('sha256', getSecret()).update(`${header}.${payload}`).digest('binary')
  );
  return `${header}.${payload}.${sig}`;
}

export function validarToken(token) {
  if (!token) return null;
  try {
    const [header, payload, sig] = token.split('.');
    if (!header || !payload || !sig) return null;

    const expectedSig = base64url(
      createHmac('sha256', getSecret()).update(`${header}.${payload}`).digest('binary')
    );
    if (sig !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function extrairToken(req) {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return req.body?.sessionToken || null;
}
