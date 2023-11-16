

export async function mainFlow(sock, response) {
    sock.sendMessage(response.messages[0].key.remoteJid, {
        text: "Esto es una prueba de automatización."
    });
}

