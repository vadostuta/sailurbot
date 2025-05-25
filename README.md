# sailurbot ⛵

This is a tribute to the [@FridaySailer](https://x.com/FridaySailer) account, created by [@silly2tilly](https://x.com/silly2tilly).
Since they stopped posting the weekly sailing reminder messages, I decided to create my own automated version using a Telegram bot and Cloudflare Workers.

---

## ✨ What This Bot Does

* Lets users subscribe via `/start` and unsubscribe via `/stop`
* Automatically sends a sailing video to all subscribers every Friday at 17:00
* Stores subscriber info using Cloudflare KV
* Includes a secure `/run-cron` test endpoint and `/test` route

---

## 🚀 How to Deploy Your Own Version

### 1. **Fork or Clone This Repository**

```bash
git clone https://github.com/vadostuta/sailurbot.git
cd sailurbot
```

---

### 2. **Install Wrangler (Cloudflare CLI)**

```bash
npm install -g wrangler
```

---

### 3. **Create Cloudflare KV Namespace**

In your Cloudflare dashboard:

* Go to Workers → KV → Create Namespace (e.g., `users_kv`)
* Copy the **KV ID** and paste it into `wrangler.toml` under `[[kv_namespaces]]`

```toml
[[kv_namespaces]]
binding = "USERS_KV"
id = "YOUR_KV_NAMESPACE_ID"
```

---

### 4. **Configure Your Worker**

Edit `wrangler.toml`:

```toml
name = "sailer"
main = "index.js"
compatibility_date = "2024-01-01"

[triggers]
crons = ["0 17 * * 6"]  # Every Friday at 17:00 (Cloudflare format)

[vars]
CRON_KEY = "your-secret-key-here"  # Used to protect the /run-cron route

[[kv_namespaces]]
binding = "USERS_KV"
id = "your-kv-id-here"
```

---

### 5. **Set Secrets (Do NOT hardcode them)**

```bash
wrangler secret put BOT_TOKEN
```

You’ll be prompted to paste your Telegram bot token.

---

### 6. **Deploy the Worker**

```bash
wrangler deploy
```

After deployment, note the URL, e.g.
`https://sailer.your-subdomain.workers.dev`

---

### 7. **Set Telegram Webhook**

In your browser or using `curl`, run:

```bash
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://sailer.your-subdomain.workers.dev/webhook
```

Replace `<YOUR_BOT_TOKEN>` and the Worker URL.

---

## 💡 Test Routes

* `GET /test` → confirms the bot is deployed
* `GET /run-cron?key=your-secret-key` → manually trigger video push (protected)

---

## 🔐 Security Notes

* Never share your **bot token**, **chat ID**, or **secret keys** publicly
* All sensitive data is stored via `wrangler secret` or Cloudflare dashboard
* The `/run-cron` route is protected via a secret `CRON_KEY`

---

## 📌 Useful Links

* [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
* [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
* [Telegram Bot API Docs](https://core.telegram.org/bots/api)
* [Create a Telegram Bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot)

---

## 👏 Credits

Inspired by [@FridaySailer](https://x.com/FridaySailer)
****