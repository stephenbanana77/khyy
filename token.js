// 钉钉 access_token 管理，自动缓存和刷新
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();
  
  // token 还有 5 分钟过期才重新获取
  if (cachedToken && now < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  const clientId = process.env.DINGTALK_CLIENT_ID;
  const clientSecret = process.env.DINGTALK_CLIENT_SECRET;

  const res = await fetch('https://api.dingtalk.com/v1.0/oauth2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appKey: clientId,
      appSecret: clientSecret,
    }),
  });

  const data = await res.json();

  if (!data.accessToken) {
    throw new Error('获取钉钉 token 失败: ' + JSON.stringify(data));
  }

  cachedToken = data.accessToken;
  tokenExpiry = now + data.expireIn * 1000;

  return cachedToken;
}

module.exports = { getAccessToken };
