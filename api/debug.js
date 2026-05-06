export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const results = {};

  // 1. Verifica variáveis de ambiente
  const instance    = process.env.ZAPI_INSTANCE;
  const token       = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;
  const sheetsId    = process.env.SHEETS_ID;
  const serviceAcc  = process.env.GOOGLE_SERVICE_ACCOUNT;

  results.variaveis = {
    ZAPI_INSTANCE:          instance    ? `OK (${instance.slice(0,6)}...)` : 'NÃO DEFINIDO',
    ZAPI_TOKEN:             token       ? `OK (${token.slice(0,6)}...)` : 'NÃO DEFINIDO',
    ZAPI_CLIENT_TOKEN:      clientToken ? `OK (${clientToken.slice(0,6)}...)` : 'NÃO DEFINIDO',
    SHEETS_ID:              sheetsId    ? `OK = ${sheetsId}` : 'NÃO DEFINIDO',
    GOOGLE_SERVICE_ACCOUNT: serviceAcc  ? `OK (${serviceAcc.length} chars)` : 'NÃO DEFINIDO',
  };

  // 2. Testa acesso à planilha
  try {
    if (!sheetsId || !serviceAcc) throw new Error('SHEETS_ID ou GOOGLE_SERVICE_ACCOUNT não definido');

    const credentials = JSON.parse(serviceAcc);
    results.service_account_email = credentials.client_email || 'não encontrado';

    // Gera token JWT para a Sheets API
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const now    = Math.floor(Date.now() / 1000);
    const claim  = Buffer.from(JSON.stringify({
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })).toString('base64url');

    const signingInput = `${header}.${claim}`;
    const pemKey  = credentials.private_key.replace(/\\n/g, '\n');
    const pemBody = pemKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
    const binaryKey = Buffer.from(pemBody, 'base64');
    const cryptoKey = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, Buffer.from(signingInput));
    const jwt = `${signingInput}.${Buffer.from(signature).toString('base64url')}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('Falha no token: ' + JSON.stringify(tokenData));
    results.token_google = 'OK';

    // Testa leitura da aba consolidado_app
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/consolidado_app?majorDimension=ROWS`;
    const sheetsRes = await fetch(url, { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
    const sheetsData = await sheetsRes.json();

    if (!sheetsRes.ok) {
      results.sheets_leitura = `ERRO ${sheetsRes.status}: ${sheetsData.error?.message}`;
    } else {
      const rows = sheetsData.values || [];
      results.sheets_leitura = `OK — ${rows.length} linhas encontradas`;
      results.sheets_cabecalho = rows[0]?.slice(0, 5) || [];
      results.sheets_primeira_linha = rows[1]?.slice(0, 5) || [];
      results.sheets_num_colunas = rows[0]?.length || 0;

      // Busca CPF de teste
      const cpfTeste = (req.query?.cpf || '32859264817').replace(/\D/g, '');
      let cpfEncontrado = false;
      for (let i = 1; i < rows.length; i++) {
        if ((rows[i][2] || '').replace(/\D/g, '') === cpfTeste) {
          cpfEncontrado = true;
          results.cpf_busca = `CPF ${cpfTeste} ENCONTRADO na linha ${i+1}`;
          results.cpf_dados = {
            siape: rows[i][0],
            nome: rows[i][1],
            cpf: rows[i][2],
            email: rows[i][10],
            telefone: rows[i][12],
          };
          break;
        }
      }
      if (!cpfEncontrado) results.cpf_busca = `CPF ${cpfTeste} NÃO encontrado nas ${rows.length} linhas`;
    }

  } catch (err) {
    results.sheets_erro = err.message;
  }

  return res.status(200).json(results);
}
