const {
  default: makeWASocket,
  WASocket,
  AuthenticationState,
  BufferJSON,
  initInMemoryKeyStore,
  WAMessage,
  Contact,
  SocketConfig,
  DisconnectReason,
  BaileysEventMap,
  GroupMetadata,
  AnyMessageContent,
  MessageType,
  MiscMessageGenerationOptions,
} = require("@adiwajshing/baileys");

async function connectToWhatsApp() {
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
  });
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });
  sock.ev.on("messages.upsert", async (m) => {
    console.log(JSON.stringify(m, undefined, 2));

    console.log("replying to", m.messages[0].key.remoteJid);
    await sock.sendMessage(m.messages[0].key.remoteJid, {
      text: "Hello there!",
    });
  });
}
// run in main file
connectToWhatsApp();
