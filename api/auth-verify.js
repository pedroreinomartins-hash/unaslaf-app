// api/auth-verify.js — Valida código lido da coluna Q da planilha

const { google } = require('googleapis');

async function getSheetsClient(readonly = true) {
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
  const sheetId  = process.env.SHEETS_ID;
  const cleanCPF = cpf.replace(/\D/g, '');

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:Q',
  });

  const rows = res.data.values || [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowCPF = (row[3] || '').replace(/\D/g, '');
    if (rowCPF === cleanCPF) {
      return {
        rowIndex: i + 1,
        siape:       row[1]  || '',
        nome:        row[2]  || '',
        cpf:         row[3]  || '',
        email:       row[4]  || '',
        telefone:    row[5]  || '',
        cargo:       row[7]  || '',
        tipo:        row[8]  || '',
        situacao:    row[9]  || '',
        orgao:       row[10] || '',
        endereco:    row[11] || '',
        cidade:      row[12] || '',
        uf:          row[13] || '',
        codeStored:  row[16] || '', // coluna Q
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { cpf, code } = req.body || {};
    if (!cpf || !code) {
      return res.status(400).json({ error: 'CPF e código são obrigatórios' });
    }

    const associate = await findAssociate(cpf);
    if (!associate) {
      return res.status(404).json({ error: 'Associado não encontrado' });
    }

    if (!associate.codeStored) {
      return res.status(401).json({ error: 'Código não solicitado ou já expirado' });
    }

    const [storedCode, storedExpires] = associate.codeStored.split(':');

    if (Date.now() > parseInt(storedExpires)) {
      return res.status(401).json({ error: 'Código expirado. Solicite um novo.' });
    }

    if (storedCode !== code.trim()) {
      return res.status(401).json({ error: 'Código incorreto. Tente novamente.' });
    }

    // Limpa código da planilha após uso bem-sucedido
    const sheets = await getSheetsClient(false);
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEETS_ID,
      range: `Sheet1!Q${associate.rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values: [['']] }
    });

    return res.status(200).json({
      success: true,
      associate: {
        nome:     associate.nome,
        cpf:      associate.cpf,
        siape:    associate.siape,
        email:    associate.email,
        telefone: associate.telefone,
        cargo:    associate.cargo,
        tipo:     associate.tipo,
        situacao: associate.situacao,
        orgao:    associate.orgao,
        endereco: associate.endereco,
        cidade:   associate.cidade,
        uf:       associate.uf,
        rowIndex: associate.rowIndex
      }
    });

  } catch (err) {
    console.error('[auth-verify] Erro:', err);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
};
