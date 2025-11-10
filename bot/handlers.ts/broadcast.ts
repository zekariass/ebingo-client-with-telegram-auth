// import type { Telegraf, Context } from "telegraf";
// import type { Message } from "telegraf/types";

// const API_BASE_URL = process.env.BACKEND_BASE_URL!;
// const ADMIN_IDS = (process.env.ADMIN_IDS || "").split(",").map((id) => id.trim());

// // Map to track which admin is currently broadcasting
// const broadcastingAdmins = new Map<string, boolean>();

// export function registerBroadcastHandler(bot: Telegraf<Context>) {
//   bot.command("broadcast", async (ctx) => {
//     const currentUserId = String(ctx.from?.id);

//     if (!ADMIN_IDS.includes(currentUserId)) {
//       return ctx.reply("🚫 You are not authorized to use this command.");
//     }

//     // Prevent starting multiple broadcasts for the same admin
//     if (broadcastingAdmins.get(currentUserId)) {
//       return ctx.reply("⚠️ You already have a broadcast in progress. Please finish it first.");
//     }

//     broadcastingAdmins.set(currentUserId, true);

//     ctx.reply(
//       "✉️ Please send the message you want to broadcast.\n" +
//         "You can send:\n" +
//         "- Text message\n" +
//         "- Image with caption"
//     );

//     // Temporary listener for this admin only
//     const handler = async (msgCtx: Context) => {
//       if (String(msgCtx.from?.id) !== currentUserId) return;

//       const message = msgCtx.message;
//       if (!message) return;

//       let sendType: "text" | "photo" = "text";
//       let text = "";
//       let photoUrl: string | undefined;

//       if ("text" in message && message.text) {
//         sendType = "text";
//         text = message.text;
//       } else if ("photo" in message && message.photo?.length) {
//         sendType = "photo";
//         const photo = message.photo[message.photo.length - 1];
//         photoUrl = photo.file_id;
//         text = message.caption || "";
//       } else {
//         return msgCtx.reply("⚠️ Unsupported message type. Please send text or a photo with caption.");
//       }

//       msgCtx.reply("📡 Sending your message to all users...");

//       try {
//         const response = await fetch(`${API_BASE_URL}/api/v1/secured/user-profile/user-telegram-ids`);
//         const result = await response.json();
//         const userIds: number[] = result.data?.ids || [];

//         if (userIds.length === 0) {
//           broadcastingAdmins.delete(currentUserId);
//           return msgCtx.reply("⚠️ No users found to broadcast.");
//         }

//         let sent = 0;
//         let failed = 0;

//         for (const id of userIds) {
//           try {
//             if (sendType === "text") {
//               await bot.telegram.sendMessage(id, text, { parse_mode: "HTML" });
//             } else if (sendType === "photo" && photoUrl) {
//               await bot.telegram.sendPhoto(id, photoUrl, { caption: text, parse_mode: "HTML" });
//             }
//             sent++;
//             await new Promise((r) => setTimeout(r, 50));
//           } catch (err: any) {
//             console.error(`Failed to send to ${id}:`, err.description || err.message);
//             failed++;
//           }
//         }

//         msgCtx.reply(`✅ Broadcast complete.\nSent: ${sent}\nFailed: ${failed}`);
//       } catch (err) {
//         console.error("Broadcast error:", err);
//         msgCtx.reply("❌ Failed to send broadcast.");
//       } finally {
//         // Mark admin as free
//         broadcastingAdmins.delete(currentUserId);
//       }
//     };

//     // Listen for the next message from this admin only
//     bot.on("message", handler);

//     // Optional: auto-stop listener after some timeout (e.g., 2 minutes)
//     setTimeout(() => {
//       broadcastingAdmins.delete(currentUserId);
//     }, 2 * 60 * 1000);
//   });
// }



import type { Telegraf, Context } from "telegraf";

const API_BASE_URL = process.env.BACKEND_BASE_URL!;
const ADMIN_IDS = (process.env.ADMIN_IDS || "").split(",").map((id) => id.trim());

// Track admins waiting to send broadcast messages
const waitingForBroadcast = new Map<string, boolean>();

export function registerBroadcastHandler(bot: Telegraf<Context>) {
  // Command to start broadcast
  bot.command("broadcast", async (ctx) => {
    const userId = String(ctx.from?.id);
    if (!ADMIN_IDS.includes(userId)) return ctx.reply("🚫 You are not authorized.");

    if (waitingForBroadcast.get(userId)) {
      return ctx.reply("⚠️ You already have a broadcast in progress.");
    }

    waitingForBroadcast.set(userId, true);
    ctx.reply(
      "✉️ Please send the message you want to broadcast.\n" +
        "You can send:\n" +
        "- Text message\n" +
        "- Image with caption"
    );
  });

  // Global message handler
  bot.on("message", async (ctx) => {
    const userId = String(ctx.from?.id);

    // Only handle messages from admins who are waiting
    if (!waitingForBroadcast.get(userId)) return;

    const message = ctx.message;
    if (!message) return;

    waitingForBroadcast.delete(userId); // clear state immediately

    let sendType: "text" | "photo" = "text";
    let text = "";
    let photoUrl: string | undefined;

    if ("text" in message && message.text) {
      sendType = "text";
      text = message.text;
    } else if ("photo" in message && message.photo?.length) {
      sendType = "photo";
      const photo = message.photo[message.photo.length - 1];
      photoUrl = photo.file_id;
      text = message.caption || "";
    } else {
      return ctx.reply("⚠️ Unsupported message type. Please send text or a photo with caption.");
    }

    ctx.reply("📡 Sending your message to all users...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/secured/user-profile/user-telegram-ids`);
      const result = await response.json();
      const userIds: number[] = result.data?.ids || [];

      if (userIds.length === 0) return ctx.reply("⚠️ No users found to broadcast.");

      let sent = 0;
      let failed = 0;

      for (const id of userIds) {
        try {
          if (sendType === "text") {
            await bot.telegram.sendMessage(id, text, { parse_mode: "HTML" });
          } else if (sendType === "photo" && photoUrl) {
            await bot.telegram.sendPhoto(id, photoUrl, { caption: text, parse_mode: "HTML" });
          }
          sent++;
          await new Promise((r) => setTimeout(r, 40));
        } catch (err: any) {
          console.error(`Failed to send to ${id}:`, err.description || err.message);
          failed++;
        }
      }

      ctx.reply(`✅ Broadcast complete.\nSent: ${sent}\nFailed: ${failed}`);
    } catch (err) {
      console.error("Broadcast error:", err);
      ctx.reply("❌ Failed to send broadcast.");
    }
  });
}
