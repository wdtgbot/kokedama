import axios from 'axios'
import { Telegraf } from 'telegraf'

import { getTweetById } from '../utils'

export default async function downloadTweetVideo(
  bot: Telegraf,
  tweetOrId: string,
  chatId: number,
  replyMsgId?: number,
) {
  const tweet =
    typeof tweetOrId === 'string' ? await getTweetById(tweetOrId) : tweetOrId
  const tweetId = tweet.data.id

  const video =
    tweet.includes?.media?.some(
      (e: any) => e.type === 'video' || e.type === 'animated_gif',
    ) ?? false
  if (video) {
    const videoBuf = await axios
      .get(tweet.includes.media[0].variants[0].url, {
        responseType: 'arraybuffer',
      })
      .then(({ data }) => Buffer.from(data))
    await bot.telegram.sendDocument(
      chatId,
      {
        filename: `${tweetId}_video.mp4`,
        source: Buffer.from(videoBuf),
      },
      {
        reply_to_message_id: replyMsgId,
        allow_sending_without_reply: true,
        disable_notification: true,
      },
    )
  }
}
