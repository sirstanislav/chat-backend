const registerMessage = (client) => {
  client.on('sendAllMessages', (arg) => {
    client.broadcast.emit('getAllmessages', arg);
  });
};

module.exports = {
  registerMessage,
};
