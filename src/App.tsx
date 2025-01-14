import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const apiKey = import.meta.env.VITE_GETSTREAM_API_KEY;
  const userId = import.meta.env.VITE_GETSTREAM_USER_ID;
  const token = import.meta.env.VITE_GETSTREAM_JWT;

  const chatClientConfig = {
    apiKey,
    tokenOrProvider: token,
    userData: { id: userId },
  };
  console.log("config: ", chatClientConfig);

  const chatClient = useCreateChatClient(chatClientConfig);
  console.log("chat client: ", chatClient);

  console.log("Chat client: ", chatClient);

  if (!chatClient) {
    return <div>Loading chat...</div>;
  }

  const channel = chatClient.getChannelById("livestream", "messaging", {});

  return (
    <Chat client={chatClient as any}>
      <h1>Vite + React</h1>
      <Channel channel={channel}>
        <div className="chat-mangler">
        <MessageList />
        <MessageInput />
        </div>
      </Channel>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Chat>
  );
}

export default App;
