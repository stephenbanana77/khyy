直接复制替换 GitHub 里的 `write-lead.js`：

```javascript
const { getAccessToken } = require('../lib/token');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-api-key'] || '';
  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, phone, last_message, appointment_date, location, area, style } = req.body;

  if (!name && !phone) {
    return res.status(400).json({ error: '缺少客户信息' });
  }

  try {
    const token = await getAccessToken();
    const workbookId = process.env.DINGTALK_NODE_ID;
    const sheetId = process.env.DINGTALK_SHEET_ID;

    console.log('开始写入，workbookId:', workbookId, 'sheetId:', sheetId);

    const response = await fetch(
      `https://api.dingtalk.com/v1.0/doc/workbooks/${workbookId}/sheets/${sheetId}/values/append`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acs-dingtalk-access-token': token,
        },
        body: JSON.stringify({
          values: [[
            name || '',
            phone || '',
            appointment_date || '',
            location || '',
            area || '',
            style || '',
            last_message || '',
            new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          ]],
        }),
      }
    );

    const result = await response.json();
    console.log('钉钉API返回:', JSON.stringify(result));

    if (!response.ok) {
      console.error('钉钉 API 错误:', result);
      return res.status(500).json({ error: '写入失败', detail: result });
    }

    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('服务错误:', err);
    return res.status(500).json({ error: err.message });
  }
};
```

保存提交后 Vercel 自动部署，等1分钟再去 Dify 测试，把 Vercel Logs 的结果发给我。
