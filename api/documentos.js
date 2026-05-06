// api/documentos.js — Lista e serve arquivos da pasta Google Drive

const { google } = require('googleapis');

const CATEGORIA_MAP = [
  { regex: /filia/i,               label: 'Filiação' },
  { regex: /desfilia|cancelamento/i, label: 'Desfiliação' },
  { regex: /procura/i,             label: 'Procuração' },
  { regex: /requerimento|solicit/i, label: 'Requerimentos' },
  { regex: /formulario|ficha/i,    label: 'Formulários' },
];

function detectCategoria(nome) {
  for (const c of CATEGORIA_MAP) {
    if (c.regex.test(nome)) return c.label;
  }
  return 'Geral';
}

async function getDriveClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  return google.drive({ version: 'v3', auth: await auth.getClient() });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const folderId = process.env.REPO_FOLDER_ID;

  // GET /api/documentos — Lista arquivos
  if (req.method === 'GET' && !req.query.id) {
    try {
      const drive = await getDriveClient();
      const result = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, modifiedTime)',
        orderBy: 'name',
        pageSize: 100,
      });

      const files = (result.data.files || []).map(f => ({
        id:           f.id,
        nome:         f.name,
        tipo:         f.mimeType,
        tamanho:      f.size ? Math.round(parseInt(f.size) / 1024) + ' KB' : '—',
        modificado:   f.modifiedTime
          ? new Date(f.modifiedTime).toLocaleDateString('pt-BR')
          : '—',
        categoria:    detectCategoria(f.name),
        downloadUrl:  `/api/documentos?id=${f.id}`,
      }));

      return res.status(200).json({ files });

    } catch (err) {
      console.error('[documentos GET list] Erro:', err);
      return res.status(500).json({ error: 'Erro ao listar documentos', detail: err.message });
    }
  }

  // GET /api/documentos?id=FILE_ID — Serve o arquivo para download
  if (req.method === 'GET' && req.query.id) {
    try {
      const fileId = req.query.id;
      const drive  = await getDriveClient();

      // Obtém metadados
      const meta = await drive.files.get({
        fileId,
        fields: 'name, mimeType',
      });

      const fileName = meta.data.name;
      const mimeType = meta.data.mimeType;

      // Google Docs nativos precisam ser exportados
      let stream;
      if (mimeType.includes('google-apps')) {
        const exportMime = mimeType.includes('document')
          ? 'application/pdf'
          : mimeType.includes('spreadsheet')
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf';

        const resp = await drive.files.export(
          { fileId, mimeType: exportMime },
          { responseType: 'stream' }
        );
        res.setHeader('Content-Type', exportMime);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}.pdf"`);
        resp.data.pipe(res);
      } else {
        const resp = await drive.files.get(
          { fileId, alt: 'media' },
          { responseType: 'stream' }
        );
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        resp.data.pipe(res);
      }

    } catch (err) {
      console.error('[documentos GET file] Erro:', err);
      return res.status(500).json({ error: 'Erro ao baixar arquivo', detail: err.message });
    }
  }
};
