# Chat

## About

[Check frontend repository](https://github.com/sirstanislav/chat-frontend)

In this project i make the chat page with real-time update of messages over [RTK Query](https://redux-toolkit.js.org/tutorials/rtk-query) and [Socket Io](https://socket.io/).

![Previw](https://github.com/sirstanislav/chat-frontend/blob/main/src/images/chat.png?raw=true)

## Online
[Chat Online](https://chat-frontend-u3jf.onrender.com/)

Because of what backend deployed on the free tier services, you need wait a couple minutes to wake up docker container. Open DevTools to check is the request passing with 200.

## Tech

Check `chatApi.ts` on the Client to see implementation:

The first thing it connect to backend via socket io.

```ts
const socket = io(`https://chatback.fly.dev`, {
  transportOptions: {
    polling: {
      extraHeaders: {
        'Authorization': `Bearer ${token}`,
      },
    },
  },
});
```
Then when the `socket.emit` message is send via mutation traugh RTKQ from client,

```ts
sendMessage: builder.mutation({
      query: ({ token, message }) => ({
        url: 'messages',
        method: 'POST',
        body: message,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'authorization': `Bearer ${token}`
        },
      }),
      invalidatesTags: ['Messaages'],
      async onQueryStarted(arg) {
        socket.emit('sendAllMessages', arg.message)
      }
    })
```

it coming to the server and broadcasting this message to all other client:

```js
const registerMessage = (client) => {
  client.on('sendAllMessages', (arg) => {
    client.broadcast.emit('getAllmessages', arg);
  });
};
```
on the all clients first query to receive message, call async function that open websocket connection and wait for a new message:
```ts
allMessages: builder.query<Message[], string | null>({
  query: (token) => ({
    url: 'messages',
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'authorization': `Bearer ${token}`
    },
  }),
  providesTags: ['Messaages'],
    async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
      try {
        await cacheDataLoaded
        const listener = (messages: Message) => {
          updateCachedData((draft) => {
            draft.push(messages)
          })
        }
        socket.on('getAllmessages', listener)
      } catch {
      }
      await cacheEntryRemoved
      socket.close()
    }
}),
```

[More about this on RTKQ documentation](https://redux-toolkit.js.org/rtk-query/usage/streaming-updates#streaming-update-examples)
