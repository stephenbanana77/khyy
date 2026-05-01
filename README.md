# Build Ant Design 钉钉中间服务

## 部署步骤

### 1. 上传到 GitHub
把这个文件夹上传到你的 GitHub 仓库。

### 2. 在 Vercel 部署
1. 打开 vercel.com，用 GitHub 账号登录
2. 点「New Project」，选择这个仓库
3. 点「Deploy」

### 3. 配置环境变量
在 Vercel 项目设置里，添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| DINGTALK_CLIENT_ID | dingfu8ids1lx91ji3mm |
| DINGTALK_CLIENT_SECRET | 你的完整 ClientSecret |
| DINGTALK_NODE_ID | nYMoO1rWxaw51bbasz1OzvdwV47Z3je9 |
| DINGTALK_SHEET_ID | hERWDMS |
| API_SECRET_KEY | buildant2024secret |

### 4. 测试接口
部署完成后，Vercel 会给你一个域名，比如 `https://buildant-dingtalk-service.vercel.app`

测试健康检查：
```
GET https://你的域名/api/health
```

测试写入：
```
POST https://你的域名/api/write-lead
Headers:
  Content-Type: application/json
  x-api-key: buildant2024secret

Body:
{
  "name": "测试客户",
  "phone": "+60123456789",
  "last_message": "我想预约周六过来",
  "appointment_date": "2025-05-10",
  "location": "Georgetown",
  "area": "1200",
  "style": "轻奢"
}
```

### 5. 配置 Salesmartly 外部请求
把 Salesmartly 自动化流程的外部请求 URL 改成：
```
POST https://你的域名/api/write-lead
Headers: x-api-key: buildant2024secret
```

Body：
```json
{
  "name": "{{NAME}}",
  "phone": "{{PHONE}}",
  "last_message": "{{LAST_INPUT_TEXT}}"
}
```
