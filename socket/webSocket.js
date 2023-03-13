class WebSockets {
  users = ['user1', 'user2', 'user3'];

  connection(client) {
    // event fired when the chat room is disconnected
    client.on('disconnect', () => {
      this.users = this.users.filter((user) => user.socketId !== client.id);
    });
    // add identity of user mapped to the socket id
    client.on('identity', (userId) => {
      this.users.push({
        socketId: client.id,
        userId,
      });
    });
    // subscribe person to chat & other user as well
    client.on('subscribe', (chat, otherUserId = '') => {
      this.subscribeOtherUser(chat, otherUserId);
      client.join(chat);
    });
    // mute a chat room
    client.on('unsubscribe', (chat) => {
      client.leave(chat);
    });
  }

  subscribeOtherUser(chat, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.userId === otherUserId,
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(chat);
      }
      return userInfo;
    });
  }
}

module.exports = new WebSockets();
