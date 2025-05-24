# sailurbot

This is tribute to the https://x.com/FridaySailer account, created by https://x.com/silly2tilly.
Since he stops to posting the weekly reminder messages, I decided to make my own for myself.

---

## How to Deploy Your Own Worker

1. **Fork or Clone this Repository**
   ```sh
   git clone https://github.com/vadostuta/sailurbot.git
   cd sailurbot
   ```

2. **Install Wrangler (Cloudflare's CLI)**
   ```sh
   npm install -g wrangler
   ```

3. **Configure Your Worker**
   - Edit `wrangler.toml`:
     - Change the `name` field to your desired Worker name (e.g., `reminderbot`).
   - Set your environment variables (such as `BOT_TOKEN`, `USER_CHAT_ID`, etc.) using the Cloudflare dashboard or with Wrangler secrets:
     ```sh
     wrangler secret put BOT_TOKEN
     wrangler secret put USER_CHAT_ID
     # Add any other required secrets
     ```

4. **Deploy to Cloudflare**
   ```sh
   wrangler deploy
   ```

5. **Test Your Worker**
   - Visit:
     ```
     https://[worker-name].[your-subdomain].workers.dev/test
     ```

   - **Example:**  
     If your Worker name is `reminderbot` and your subdomain is `myuser`, your test URL will be:  
     ```
     https://reminderbot.myuser.workers.dev/test
     ```

---

## Security Note

- **Never share your real bot token, chat ID, or any other sensitive data in public repositories or documentation.**
- Always use environment variables or Cloudflare secrets to keep your credentials safe.

---

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
