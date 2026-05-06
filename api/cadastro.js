// api/cadastro.js — Leitura e atualização de cadastro na planilha Google Sheets

const { google } = require('googleapis');

async function getSheetsClient(readonly = false) {
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
  // Garante que a aba "Histórico" existe
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const abas = meta.data.sheets.map(s => s.properties.title);
  if (!abas.includes('Histórico')) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: { title: 'Histórico' }
          }
        }]
      }
    });
    // Cabeçalho
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Histórico!A1:F1',
      valueInputOption: 'RAW',
      requestBody: { values: [['Data/Hora', 'CPF', 'Nome', 'Campo', 'Valor Novo', 'Alterado por']] }
    });
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sheetId = process.env.SHEETS_ID;

  // GET /api/cadastro?cpf=XXX — Retorna dados do associado
  if (req.method === 'GET') {
    try {
      const cpf = (req.query?.cpf || '').replace(/\D/g, '');
      if (!cpf) return res.status(400).json({ error: 'CPF não informado' });

      const sheets = await getSheetsClient(true);
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1!A:P',
      });

      const rows = result.data.values || [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowCPF = (row[3] || '').replace(/\D/g, '');
        if (rowCPF === cpf) {
          return res.status(200).json({
            rowIndex: i + 1,
            siape:    row[1]  || '',
            nome:     row[2]  || '',
            cpf:      row[3]  || '',
            email:    row[4]  || '',
            telefone: row[5]  || '',
            obs:      row[6]  || '',
            cargo:    row[7]  || '',
            tipo:     row[8]  || '',
            situacao: row[9]  || '',
            orgao:    row[10] || '',
            endereco: row[11] || '',
            cidade:   row[12] || '',
            uf:       row[13] || '',
          });
        }
      }
      return res.status(404).json({ error: 'Associado não encontrado' });

    } catch (err) {
      console.error('[cadastro GET] Erro:', err);
      return res.status(500).json({ error: 'Erro ao buscar cadastro', detail: err.message });
    }
  }

  // POST /api/cadastro — Atualiza dados do associado
  if (req.method === 'POST') {
    try {
      const { cpf, rowIndex, nome, email, telefone, endereco, cidade, uf } = req.body || {};

      if (!cpf || !rowIndex) {
        return res.status(400).json({ error: 'CPF e rowIndex são obrigatórios' });
      }
      if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Nome, e-mail e telefone são obrigatórios' });
      }

      const sheets = await getSheetsClient(false);

      // Lê valores atuais para merge inteligente (não sobrescreve com vazio)
      const current = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `Sheet1!A${rowIndex}:P${rowIndex}`,
      });
      const cur = (current.data.values || [[]])[0] || [];

      const merge = (newVal, curVal) => (newVal && newVal.trim() !== '') ? newVal.trim() : (curVal || '');

      const updatedRow = [
        cur[0] || '',    // A - Origem
        cur[1] || '',    // B - SIAPE (bloqueado)
        merge(nome, cur[2]),      // C - Nome
        cur[3] || '',    // D - CPF (bloqueado)
        merge(email, cur[4]),     // E - Email
        merge(telefone, cur[5]),  // F - Telefone
        cur[6] || '',    // G - Obs
        cur[7] || '',    // H - Cargo (bloqueado)
        cur[8] || '',    // I - Tipo
        cur[9] || '',    // J - Situação
        cur[10] || '',   // K - Órgão
        merge(endereco, cur[11]), // L - Endereço
        merge(cidade, cur[12]),   // M - Cidade
        merge(uf, cur[13]),       // N - UF
        new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), // O - Data Atualização
        'Usuário',       // P - Alterado por
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Sheet1!A${rowIndex}:P${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: { values: [updatedRow] }
      });

      // Registra no histórico
      await ensureHistoricoSheet(sheets, sheetId);
      const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Histórico!A:F',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[
            now,
            cpf,
            updatedRow[2],
            'Atualização de cadastro',
            `Nome: ${updatedRow[2]} | Email: ${updatedRow[4]} | Tel: ${updatedRow[5]}`,
            'Usuário'
          ]]
        }
      });

      return res.status(200).json({ success: true, message: 'Cadastro atualizado com sucesso!' });

    } catch (err) {
      console.error('[cadastro POST] Erro:', err);
      return res.status(500).json({ error: 'Erro ao salvar cadastro', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
