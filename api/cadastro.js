// api/cadastro.js — Leitura e atualização de cadastro
// Planilha: App_Cadastro Oficial_Unaslaf
// Campos editáveis pelo associado: K(email), M(tel1), P(logradouro), Q(número), S(bairro), T(cidade), U(cep), V(uf)
// Campos bloqueados: A(SIAPE), B(Nome), C(CPF)

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

async function ensureHistoricoSheet(sheets, sheetId) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const abas = meta.data.sheets.map(s => s.properties.title);
  if (!abas.includes('Histórico')) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: 'Histórico' } } }] }
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Histórico!A1:F1',
      valueInputOption: 'RAW',
      requestBody: { values: [['Data/Hora','CPF','Nome','Ação','Detalhes','Alterado por']] }
    });
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sheetId = process.env.SHEETS_ID;

  if (req.method === 'GET') {
    try {
      const cpf    = (req.query?.cpf || '').replace(/\D/g, '');
      if (!cpf) return res.status(400).json({ error: 'CPF não informado' });

      const sheets = await getSheetsClient(true);
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1!A:V',
      });

      const rows = result.data.values || [];
      for (let i = 1; i < rows.length; i++) {
        const row    = rows[i];
        const rowCPF = (row[2] || '').replace(/\D/g, '');
        if (rowCPF === cpf) {
          return res.status(200).json({
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
          });
        }
      }
      return res.status(404).json({ error: 'Associado não encontrado' });

    } catch (err) {
      console.error('[cadastro GET]', err.message);
      return res.status(500).json({ error: 'Erro ao buscar cadastro', detail: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { cpf, rowIndex, email, telefone, logradouro, numero, bairro, cidade, cep, uf } = req.body || {};
      if (!cpf || !rowIndex) return res.status(400).json({ error: 'CPF e rowIndex são obrigatórios' });
      if (!email || !telefone) return res.status(400).json({ error: 'E-mail e telefone são obrigatórios' });

      const sheets = await getSheetsClient(false);

      // Lê linha atual para merge inteligente (não apaga campos existentes com vazio)
      const cur = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `Sheet1!A${rowIndex}:V${rowIndex}`,
      });
      const row = ((cur.data.values || [[]])[0]) || [];
      const m = (novo, atual) => (novo && novo.trim()) ? novo.trim() : (atual || '');

      // Atualiza apenas os campos editáveis (K=10, M=12, P=15, Q=16, S=18, T=19, U=20, V=21)
      // Usa update por células individuais para não tocar nos outros campos
      const updates = [
        { range: `Sheet1!K${rowIndex}`, values: [[m(email,      row[10])]] },
        { range: `Sheet1!M${rowIndex}`, values: [[m(telefone,   row[12])]] },
        { range: `Sheet1!P${rowIndex}`, values: [[m(logradouro, row[15])]] },
        { range: `Sheet1!Q${rowIndex}`, values: [[m(numero,     row[16])]] },
        { range: `Sheet1!S${rowIndex}`, values: [[m(bairro,     row[18])]] },
        { range: `Sheet1!T${rowIndex}`, values: [[m(cidade,     row[19])]] },
        { range: `Sheet1!U${rowIndex}`, values: [[m(cep,        row[20])]] },
        { range: `Sheet1!V${rowIndex}`, values: [[m(uf,         row[21]).toUpperCase()]] },
      ];

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          valueInputOption: 'RAW',
          data: updates
        }
      });

      // Histórico
      await ensureHistoricoSheet(sheets, sheetId);
      const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Histórico!A:F',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [[
          now, cpf, row[1] || '',
          'Atualização de cadastro',
          `Email: ${m(email,row[10])} | Tel: ${m(telefone,row[12])} | Cidade: ${m(cidade,row[19])}`,
          'Usuário'
        ]] }
      });

      return res.status(200).json({ success: true, message: 'Cadastro atualizado com sucesso!' });

    } catch (err) {
      console.error('[cadastro POST]', err.message);
      return res.status(500).json({ error: 'Erro ao salvar cadastro', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
