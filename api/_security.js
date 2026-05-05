// =============================================================================
// _security.js — Funções de segurança compartilhadas entre os endpoints
// =============================================================================
// Contém:
//   - Rate limiting: limita tentativas por IP para evitar abuso
//   - JWT: gera e valida tokens de sessão após login
//
// CONFIGURAÇÕES AJUSTÁVEIS:
//   RATE_LIMITS — define o máximo de chamadas por janela de tempo por endpoint
//   JWT_EXPIRY  — tempo de validade da sessão após o login
// =============================================================================

// ── Configurações de Rate Limiting ─────────────────────────────────────────
// Cada entrada define: { max: máximo de chamadas, window: janela em ms }
const RATE_LIMITS = {
  sheet:     { max: 10,  window: 60_000  }, // login: 10 tentativas/minuto por IP
  whatsapp:  { max: 5,   window: 60_000  }, // envio código: 5 tentativas/minuto
  chat:      { max: 40,  window: 60_000  }, // chat: 40 mensagens/minuto por IP
  cadastro:  { max: 10,  window: 60_000  }, // cadastro: 10 salvamentos/minuto
  default:   { max: 60,  window: 60_000  }, // demais endpoints
};

// ── Configurações de JWT ────────────────────────────────────────────────────
const JWT_EXPIRY = 4 * 60 * 60 * 1000; // 4 horas em milissegundos

// ── Armazenamento em memória do rate limit ──────────────────────────────────
// Nota: em ambiente serverless, este mapa é local à instância.
// Para proteção distribuída seria necessário Redis (Upstash gratuito).
// Para o volume da UNASLAF, esta solução é suficiente.
const rateLimitStore = new Map();

// ── Rate Limiting ───────────────────────────────────────────────────────────
export function checkRateLimit(req, endpoint = 'default') {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
           || req.headers['x-real-ip']
           || req.socket?.remoteAddress
           || 'unknown';

  const key   = `${endpoint}:${ip}`;
  const limit = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const now   = Date.now();

  const entry = rateLimitStore.get(key) || { count: 0, start: now };

  // Resetar janela se expirou
  if (now - entry.start > limit.window) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  if (entry.count > limit.max) {
    const resetIn = Math.ceil((limit.window - (now - entry.start)) / 1000);
    return {
      blocked: true,
      message: `Muitas tentativas. Aguarde ${resetIn} segundos.`,
      resetIn,
    };
  }

  return { blocked: false };
}

// ── Limpeza periódica do store (evita vazamento de memória) ─────────────────
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    const endpoint = key.split(':')[0];
    const limit    = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
    if (now - entry.start > limit.window * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // limpa a cada 5 minutos

// ── JWT simples (sem dependência externa) ───────────────────────────────────
// Implementação leve usando HMAC-SHA256 nativo do Node.js
import { createHmac } from 'crypto';

function getSecret() {
  // Usa a chave OpenAI como segredo base (já existe no Vercel)
  // Em produção ideal seria uma variável JWT_SECRET dedicada
  return process.env.OPENAI_API_KEY?.slice(-32) || 'unaslaf-secret-fallback-2026';
}

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function gerarToken(cpf, nome) {
  const header  = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    cpf,
    nome,
    iat: Date.now(),
    exp: Date.now() + JWT_EXPIRY,
  }));
  const signature = base64url(
    createHmac('sha256', getSecret())
      .update(`${header}.${payload}`)
      .digest('binary')
  );
  return `${header}.${payload}.${signature}`;
}

export function validarToken(token) {
  if (!token) return null;
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;

    // Verifica assinatura
    const expectedSig = base64url(
      createHmac('sha256', getSecret())
        .update(`${header}.${payload}`)
        .digest('binary')
    );
    if (signature !== expectedSig) return null;

    // Verifica expiração
    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (Date.now() > data.exp) return null;

    return data; // retorna { cpf, nome, iat, exp }
  } catch {
    return null;
  }
}

// ── Helper: extrai token do header Authorization ────────────────────────────
export function extrairToken(req) {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return req.body?.sessionToken || null;
}
