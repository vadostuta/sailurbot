export default {
  // This handles the scheduled cron job
  async scheduled (event, env, ctx) {
    try {
      const videoUrl =
        'https://res.cloudinary.com/do8earcao/video/upload/1748116121861_5089_n6yoq9'

      const response = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendVideo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: env.USER_CHAT_ID,
            video: videoUrl
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to send video: ${response.statusText}`)
      }
      1

      console.log('Video sent successfully!')
    } catch (error) {
      console.error('Error sending video:', error)
    }
  },

  // This handles incoming HTTP requests (for text commands)
  async fetch (request, env, ctx) {
    try {
      const url = new URL(request.url)

      // Handle /test command
      if (url.pathname === '/test') {
        const videoUrl =
          'https://res.cloudinary.com/do8earcao/video/upload/1748116121861_5089_n6yoq9'

        const response = await fetch(
          `https://api.telegram.org/bot${env.BOT_TOKEN}/sendVideo`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chat_id: env.USER_CHAT_ID,
              video: videoUrl,
              caption: 'This is our test video! 🎥'
            })
          }
        )

        const responseData = await response.json()
        console.log('Telegram API response:', responseData)

        if (!response.ok) {
          throw new Error(
            `Failed to send video: ${
              responseData.description || response.statusText
            }`
          )
        }

        return new Response('Video sent successfully!', { status: 200 })
      }

      return new Response('Not found', { status: 404 })
    } catch (error) {
      console.error('Detailed error:', error)
      return new Response(`Error: ${error.message}`, { status: 500 })
    }
  }
}
