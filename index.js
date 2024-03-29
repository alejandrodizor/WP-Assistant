import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import { mainFlow } from "./flow/main.js";

/**
 ** Debug: true | false
 */
const debug = true;
const sentErrorMessage = true;
const numberErrorMessage = "573186312380@s.whatsapp.net";

/**
 ** Main function
 **/

async function init() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket.default({
    auth: state,
    printQRInTerminal: true,
    emitOwnEvents: debug,
  });

  /**
   ** Re-connection control
   */
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        init();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  /**
   ** Save credentials
   **/

  sock.ev.on("creds.update", saveCreds);

  /**
   ** Messages control
   **/
  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      /**
       ** Debug
       */
      if (debug) {
        console.log(JSON.stringify(messages, undefined, 2));
      }

      const m = messages[0];

      /**
       ** From User and is Notify and not Status Broadcast
       */
      if (!m.message || m.key.remoteJid == "status@broadcast")
        return; // ignore non-chat messagesq

      /**
       ** Flow
       **/

      const messageType = Object.keys(m.message)[0];

      await mainFlow(m, messageType, sock);

      // }
    } catch (error) {
      /**
       ** Send error message to Whatsapp Admin
       **/
      try {
        if (sentErrorMessage) {
          await sock.sendMessage(numberErrorMessage, {
            text:
              "*Error:* " +
              error +
              "\n\n*Request*:\n" +
              JSON.stringify(messages, undefined, 2),
          });
        }
      } catch (error) {
        console.log(error);
      }
      console.log(error);
    }
  });
}

/**
 ** Start
 */
init();
