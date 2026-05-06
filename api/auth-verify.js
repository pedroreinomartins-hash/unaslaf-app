// api/auth-verify.js — Valida código da coluna BM da planilha

const { google } = require('googleapis');

async function getSheetsClient(readonly) {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: readonly
      ? ['https://www.googleapis.com/auth/spreadsheets.readonly']
      : ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth: await auth.getClient() });
}

async function findAssociate(cpf) {
  const sheets   = await getSheetsClient(true);
  const cleanCPF = cpf.replace(/\D/g, '');

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEETS_ID,
    range: 'Sheet1!A:BM',
  });

  const rows = res.data.values || [];
  for (let i = 1; i < rows.length; i++) {
    const row    = rows[i];
    const rowCPF = (row[2] || '').replace(/\D/g, '');
    if (rowCPF === cleanCPF) {
      return {
        rowIndex:   i + 1,
        siape:      row[0]  || '',
        nome:       (row[1] || '').trim(),
        cpf:        row[2]  || '',
        email:      row[10] || '',
        telefone:   row[12] || row[13] || '',
        logradouro: row[15] || '',
        numero:     row[16] || '',
        bairro:     row[18] || '',
        cidade:     row[19] || '',
        cep:        row[20] || '',
        uf:         row[21] || '',
        situacao:   row[22] || '',
        codeStored: row[64] || '',   // col BM (índice 64)
      };
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { cpf, code } = req.body || {};
    if (!cpf || !code) return res.status(400).json({ error: 'CPF e código são obrigatórios' });

    const assoc = await findAssociate(cpf);
    if (!assoc) return res.status(404).json({ error: 'Associado não encontrado' });

    if (!assoc.codeStored) {
      return res.status(401).json({ error: 'Código não solicitado ou já expirado. Solicite um novo.' });
    }

    const [storedCode, storedExpires] = assoc.codeStored.split(':');

    if (Date.now() > parseInt(storedExpires)) {
      return res.status(401).json({ error: 'Código expirado. Solicite um novo código.' });
    }

    if (storedCode !== code.trim()) {
      return res.status(401).json({ error: 'Código incorreto. Tente novamente.' });
    }

    // Limpa o código após uso
    const sheets = await getSheetsClient(false);
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEETS_ID,
      range:         `Sheet1!BM${assoc.rowIndex}`,
      valueInputOption: 'RAW',
      requestBody:   { values: [['']] }
    });

    return res.status(200).json({
      success: true,
      associate: {
        nome:       assoc.nome,
        cpf:        assoc.cpf,
        siape:      assoc.siape,
        email:      assoc.email,
        telefone:   assoc.telefone,
        logradouro: assoc.logradouro,
        numero:     assoc.numero,
        bairro:     assoc.bairro,
        cidade:     assoc.cidade,
        cep:        assoc.cep,
        uf:         assoc.uf,
        situacao:   assoc.situacao,
        rowIndex:   assoc.rowIndex
      }
    });

  } catch (err) {
    console.error('[auth-verify]', err.message);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
};
