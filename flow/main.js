

export async function mainFlow(sock, response) {
    sock.sendMessage(response.messages[0].key.remoteJid, {
        text: "Hello World"
    });
}

