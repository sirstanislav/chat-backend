const users = [];

const subscribeOtherUser = (chat, otherUserId) => {
  const userSockets = users.filter((user) => user.userId === otherUserId);
  userSockets.map((userInfo) => {
    const socketConn = global.io.sockets.connected(userInfo.socketId);
    if (socketConn) {
      socketConn.join(chat);
    }
    return userInfo;
  });
};

const registerConnect = (client) => {
  console.log('a user connected');
  client.on('disconnect', () => {
    console.log('user disconnected');
    users.filter((user) => user.socketId !== client.id);
  });
  client.on('identity', (userId) => {
    console.log('user identity');
    users.push({
      socketId: client.id,
      userId,
    });
  });
  client.on('subscribe', (chat, otherUserId = '') => {
    console.log('user subscribe');
    subscribeOtherUser(chat, otherUserId);
    client.join(chat);
  });
  client.on('unsubscribe', (chat) => {
    console.log('user unsubscribe');
    client.leave(chat);
  });
};

module.exports = {
  registerConnect,
};
