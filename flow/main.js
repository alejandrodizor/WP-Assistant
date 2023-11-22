

export async function mainFlow(response, sock) {

    if(response.messages[0].message.conversation === undefined) {
        return;
    }
    sock.sendMessage(response.messages[0].key.remoteJid, {
        text: "Esto es una prueba de automatización."
    });
}

