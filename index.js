async function sendVideoToAllUsers (env) {
  const videoUrl =
    'https://res.cloudinary.com/do8earcao/video/upload/1748116121861_5089_n6yoq9'

  const list = await env.USERS_KV.list({ prefix: 'user:' })

  console.log(`📊 Total users to notify: ${list.keys.length}`)

  for (const key of list.keys) {
    const user = await env.USERS_KV.get(key.name, { type: 'json' })
    const chatId = user?.chatId

    if (chatId) {
      const res = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendVideo`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            video: videoUrl
          })
        }
      )

      const data = await res.json()
      if (!res.ok) {
        console.error(`❌ Failed to send to ${chatId}: ${data.description}`)
      } else {
        console.log(`✅ Sent to ${chatId}`)
      }
    }
  }
}

export default {
  // 🔁 Runs every Friday at 17:00 (via cron)
  async scheduled (event, env, ctx) {
    await sendVideoToAllUsers(env)
  },

  async fetch (request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/webhook') {
      const update = await request.json()
      const chatId = update?.message?.chat?.id
      const messageText = update?.message?.text?.trim()

      if (chatId && messageText === '/start') {
        const existing = await env.USERS_KV.get(`user:${chatId}`)

        if (!existing) {
          await env.USERS_KV.put(
            `user:${chatId}`,
            JSON.stringify({ chatId, joined: Date.now() })
          )
          console.log(`🆕 New user joined: ${chatId}`)

          // Send welcome message
          await fetch(
            `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: "👋 Welcome! You're now subscribed to the weekly sailing reminder. Wait till next Friday ⛵️"
              })
            }
          )
        } else {
          console.log(`👤 Returning user: ${chatId}`)
          await fetch(
            `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: "👋 Let's try again! You're now subscribed to the weekly sailing reminder. Wait till next Friday ⛵️"
              })
            }
          )
        }
      }

      if (messageText === '/stop') {
        await env.USERS_KV.delete(`user:${chatId}`)
        console.log(`❌ Unsubscribed user: ${chatId}`)

        await fetch(
          `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: '❌ You’ve been unsubscribed. You won’t receive weekly reminders anymore.\nYou can send /start to re-subscribe at any time.'
            })
          }
        )
      }

      return new Response('ok', { status: 200 })
    }

    if (url.pathname === '/test') {
      return new Response('Test route working! ✅', { status: 200 })
    }

    if (url.pathname === '/run-cron') {
      const requestKey = url.searchParams.get('key')

      if (requestKey !== env.CRON_KEY) {
        return new Response('sorry bro, you are not authorized to do this', {
          status: 403
        })
      }

      await sendVideoToAllUsers(env)
      return new Response('Manual cron logic executed ✅', { status: 200 })
    }

    return new Response('Not found', { status: 404 })
  }
}
