// import type { Telegraf, Context } from "telegraf";

// const API_BASE_URL = process.env.BACKEND_BASE_URL!;
// const ADMIN_IDS = (process.env.ADMIN_IDS || "").split(",").map((id) => id.trim());

// // Track admins waiting to send broadcast messages
// const waitingForBroadcast = new Map<string, boolean>();

// export function registerBroadcastHandler(bot: Telegraf<Context>) {
//   // Command to start broadcast
//   bot.command("broadcast", async (ctx) => {
//     const userId = String(ctx.from?.id);
//     if (!ADMIN_IDS.includes(userId)) return ctx.reply("🚫 You are not authorized.");

//     if (waitingForBroadcast.get(userId)) {
//       return ctx.reply("⚠️ You already have a broadcast in progress.");
//     }

//     waitingForBroadcast.set(userId, true);
//     ctx.reply(
//       "✉️ Please send the message you want to broadcast.\n" +
//         "You can send:\n" +
//         "- Text message\n" +
//         "- Image with caption"
//     );
//   });

//   // Global message handler
//   bot.on("message", async (ctx) => {
//     const userId = String(ctx.from?.id);

//     // Only handle messages from admins who are waiting
//     if (!waitingForBroadcast.get(userId)) return;

//     const message = ctx.message;
//     if (!message) return;

//     waitingForBroadcast.delete(userId); // clear state immediately

//     let sendType: "text" | "photo" = "text";
//     let text = "";
//     let photoUrl: string | undefined;

//     if ("text" in message && message.text) {
//       sendType = "text";
//       text = message.text;
//     } else if ("photo" in message && message.photo?.length) {
//       sendType = "photo";
//       const photo = message.photo[message.photo.length - 1];
//       photoUrl = photo.file_id;
//       text = message.caption || "";
//     } else {
//       return ctx.reply("⚠️ Unsupported message type. Please send text or a photo with caption.");
//     }

//     ctx.reply("📡 Sending your message to all users...");

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/secured/user-profile/user-telegram-ids?adminTelegramId=${userId}`);
//       const result = await response.json();
//       const userIds: number[] = result.data?.ids || [];

//       if (userIds.length === 0) return ctx.reply("⚠️ No users found to broadcast.");

//       let sent = 0;
//       let failed = 0;
//       let failedIds = [];

//       for (const id of userIds) {
//         try {
//           if (sendType === "text") {
//             await bot.telegram.sendMessage(id, text, { parse_mode: "HTML" });
//           } else if (sendType === "photo" && photoUrl) {
//             await bot.telegram.sendPhoto(id, photoUrl, { caption: text, parse_mode: "HTML" });
//           }
//           sent++;
//           await new Promise((r) => setTimeout(r, 40));
//         } catch (err: any) {
//           console.error(`Failed to send to ${id}:`, err.description || err.message);
//           failed++;
//           failedIds.push(id)
//         }
//       }

//       ctx.reply(`✅ Broadcast complete.\nSent: ${sent}\nFailed: ${failed}`);
//       ctx.reply("Failed IDS: "+ JSON.stringify(failedIds))
//     } catch (err) {
//       console.error("Broadcast error:", err);
//       ctx.reply("❌ Failed to send broadcast.");
//     }
//   });
// }

import type { Telegraf, Context } from "telegraf";

const API_BASE_URL = process.env.BACKEND_BASE_URL!;
const ADMIN_IDS = (process.env.ADMIN_IDS || "").split(",").map((id) => id.trim());

// Track admins waiting to send broadcast and the prompt message id we sent them
const pendingPrompts = new Map<string, number>();

export function registerBroadcastHandler(bot: Telegraf<Context>) {
  // /broadcast command: sends a prompt with force_reply so the next admin message is a reply
  bot.command("broadcast", async (ctx) => {
    const userId = String(ctx.from?.id);
    if (!ADMIN_IDS.includes(userId)) return ctx.reply("🚫 You are not authorized.");

    if (pendingPrompts.has(userId)) {
      return ctx.reply("⚠️ You already have a broadcast in progress. Reply to the prompt or type /cancel.");
    }

    const prompt = await ctx.reply(
      "✉️ Please reply to this message with the message you want to broadcast.\n" +
        "You can send:\n" +
        "- Text message\n" +
        "- Image with caption\n\n" +
        "To cancel, type /cancel or reply 'cancel' to this message.",
      {
        reply_markup: {
          force_reply: true,
          selective: true,
        },
      }
    );

    // store prompt id so we only accept replies to that prompt
    pendingPrompts.set(userId, prompt.message_id);
  });

  // /cancel command (works anytime)
  bot.command("cancel", async (ctx) => {
    const userId = String(ctx.from?.id);
    if (pendingPrompts.has(userId)) {
      pendingPrompts.delete(userId);
      await ctx.reply("❌ Broadcast cancelled.");
    } else {
      await ctx.reply("ℹ️ No broadcast in progress.");
    }
  });

  // Global message handler: process only replies to the stored prompt
  bot.on("message", async (ctx) => {
    try {
      const fromId = String(ctx.from?.id);
      if (!pendingPrompts.has(fromId)) return; // not waiting for this user

      const expectedPromptId = pendingPrompts.get(fromId);
      const msg = ctx.message;
      if (!msg) return;

      // ensure this incoming message is a reply to the prompt
      const replyTo = (msg as any).reply_to_message;
      if (!replyTo || replyTo.message_id !== expectedPromptId) {
        // ignore messages that are not replies to the prompt
        return;
      }

      // If admin replied "cancel", handle it
      if ("text" in msg && msg.text?.trim().toLowerCase() === "cancel") {
        pendingPrompts.delete(fromId);
        return ctx.reply("❌ Broadcast cancelled.");
      }

      // Clear pending state immediately (prevents duplicate handling)
      pendingPrompts.delete(fromId);

      // Determine message type
      let sendType: "text" | "photo" = "text";
      let text = "";
      let photoFileId: string | undefined;

      if ("text" in msg && msg.text) {
        sendType = "text";
        text = msg.text;
      } else if ("photo" in msg && msg.photo?.length) {
        sendType = "photo";
        const photo = msg.photo[msg.photo.length - 1];
        photoFileId = photo.file_id;
        text = msg.caption || "";
      } else {
        return ctx.reply("⚠️ Unsupported message type. Please reply with text or a photo with caption.");
      }

      await ctx.reply("📡 Sending your message to all users...");

      // Fetch user IDs from backend with response.ok check
      const response = await fetch(
        `${API_BASE_URL}/api/v1/secured/user-profile/user-telegram-ids?adminTelegramId=${fromId}`
      );
      if (!response.ok) {
        console.error("Backend error code:", response.status);
        return ctx.reply(`❌ Backend error: ${response.status}`);
      }
      const result = await response.json();
      const userIds: number[] = result.data?.ids || [];

      if (!userIds.length) {
        return ctx.reply("⚠️ No users found to broadcast.");
      }

      let sent = 0;
      let failed = 0;
      const failedIds: number[] = [];

      // send with retry on 429 (simple backoff)
      async function sendWithRetry(sendFn: () => Promise<void>) {
        let attempts = 0;
        let backoff = 500; // ms
        while (attempts < 5) {
          try {
            await sendFn();
            return;
          } catch (err: any) {
            attempts++;
            // if it's a 429-like error attempt backoff, else rethrow
            const isRateLimit = err && (err.description?.includes("Too Many Requests") || err.code === 429);
            if (!isRateLimit || attempts >= 5) throw err;
            console.warn(`Rate limited, backing off ${backoff}ms (attempt ${attempts})`);
            await new Promise((r) => setTimeout(r, backoff));
            backoff *= 2;
          }
        }
      }

      for (const id of userIds) {
        try {
          if (sendType === "text") {
            await sendWithRetry(() => bot.telegram.sendMessage(id, text, { parse_mode: "HTML" }) as Promise<any>);
          } else {
            await sendWithRetry(() =>
              bot.telegram.sendPhoto(id, photoFileId as string, { caption: text, parse_mode: "HTML" }) as Promise<any>
            );
          }
          sent++;
          // throttle to avoid hitting Telegram limits; adjust as needed
          await new Promise((r) => setTimeout(r, 60)); // ~16 msg/sec
        } catch (err: any) {
          failed++;
          failedIds.push(id);
          console.error(`Failed to send to ${id}:`, err?.description || err?.message || err);
        }
      }

      await ctx.reply(`✅ Broadcast complete.\nSent: ${sent}\nFailed: ${failed}`);
      if (failedIds.length) {
        // if long, consider logging instead of replying
        await ctx.reply("⚠️ Failed IDs: " + JSON.stringify(failedIds));
      }
    } catch (err) {
      console.error("Unexpected handler error:", err);
      // ensure pending state is cleared to avoid stuck state
      const uid = String(ctx.from?.id);
      pendingPrompts.delete(uid);
      await ctx.reply("❌ Broadcast aborted due to an internal error.");
    }
  });
}
