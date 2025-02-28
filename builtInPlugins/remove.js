module.exports = {
  //  name: "remove",
  usage: "remove <@user>",
  desc: "Removes the tagged member from the group.",
  eg: ["remove @ankit", "remove @dibyam"],
  group: true,
  owner: false,
  async handle(Bot) {
    if (!isBotGroupAdmins) {
      Bot.replytext(Bot.mess.only.Badmin);
      return;
    }
    if (arg.length == 1) {
      Bot.wrongCommand();
      return;
    }

    const mentioned =
      Bot.reply.message.extendedTextMessage.contextInfo.mentionedJid;

    if (!mentioned) {
      Bot.wrongCommand();
      return;
    }
    const z = mentioned[0].split("@")[0];
    if (z === `${Bot.client.user.jid}`.split("@")[0]) {
      Bot.replytext(Bot.mess.error.error);
      return;
    }
    if (z === isSuperAdmin) {
      Bot.replytext(Bot.mess.error.error);

      return;
    }

    Bot.client.groupRemove(Bot.from, mentioned);

    Bot.replytext(Bot.mess.success);
  },
};
