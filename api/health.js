module.exports = async function handler(req, res) {
  return res.status(200).json({ 
    status: 'ok', 
    message: 'Build Ant 钉钉中间服务运行正常',
    time: new Date().toISOString()
  });
};
