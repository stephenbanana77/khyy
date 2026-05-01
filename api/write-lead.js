const { getAccessToken } = require('../lib/token');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 临时：打印所有headers方便调试
  console.log('收到请求 headers:', JSON.stringify(req.headers));
  console.log('环境变量 API_SECRET_KEY:', process.env.API_SECRET_KEY);

  const apiKey = req.headers['x-api-key'] || req.headers['X-Api-Key'] || '';
  console.log('收到的key:', apiKey);

  if (apiKey !== process.env.API_SECRET_KEY) {
    console.log('鉴权失败，收到:', apiKey, '期望:', process.env.API_SECRET_KEY);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, phone, last_message, appointment_date, location, area, style } = req.body;

  if (!name && !phone) {
    return res.status(400).json({ error: '缺少客户信息' });
  }

  try {
    const token = await getAccessToken();
    const nodeId = process.env.DINGTALK_NODE_ID;
    const sheetId = process.env.DINGTALK_SHEET_ID;

    const response = await fetch(
     `https://api.dingtalk.com/v1.0/doc/tables/${nodeId}/sheets/${sheetId}/values`,
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
