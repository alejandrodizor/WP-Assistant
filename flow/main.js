export async function mainFlow(response, messageType, sock) {
  if (response.key.fromMe) {
    if (messageType === "extendedTextMessage") return;

   
  } else {
    if (messageType === "conversation") {
      const message = response.message.conversation;

      if (message.startsWith("@")) {
        /*await sock.sendMessage(response.key.remoteJid, {
        text: "Esto es una prueba de automatización.",
      });*/

        await sock.sendMessage("573186312380@s.whatsapp.net", {
          text:
            "El número: " +
            response.key.remoteJid +
            " te ha enviado el siguiente mensaje: " +
            message,
        });
      }
    }

    if (messageType === "imageMessage") {
    }
  }

  console.log(response, "type:" + messageType);
}
