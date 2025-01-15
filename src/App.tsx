import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider, UseSignInData, SignInButton } from '@farcaster/auth-kit';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useEffect, useState } from 'react';
import './App.css';
import { useStore } from './store/useStore';


interface LoginResponse {
  payload?: {
    username: string;
    farcasterUsername?: string;
    jwt: string;
    pfp: string;
    addresses: `0x${string}`[];
    powerBadge: boolean;
  }
}

const optimismConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: window.location.host,
  siweUri: window.location.origin + '/api/login',
};

function App() {
  const apiKey = import.meta.env.VITE_GETSTREAM_API_KEY;
  // const userId = import.meta.env.VITE_GETSTREAM_USER_ID;
  // const token = import.meta.env.VITE_GETSTREAM_JWT;

  const { name: username, setName: setUsername, jwt: jwt, setJwt: setJwt, pfp: pfp, setPfp: setPfp, displayName, setDisplayName } = useStore();
  /*
  const [username, setUsername] = useState<string | null>(null);
  const [pfp, setPfp] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  */
  const [chatClientConfig, setChatClientConfig] = useState<ChatClientConfig | null>(null);

  useEffect(() => {
    if (username && jwt) {
      const chatClientConfig = {
        apiKey,
        tokenOrProvider: jwt,
        userData: { id: username, name: displayName || username, image: pfp },
      };

      setChatClientConfig(chatClientConfig);
    }
  }, [jwt]);

  const login = async (nonce: string, message: string, signature: string, fid: number, username: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ fid, username, signature, nonce, message, domain: window.location.host }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const data = await response.json() as LoginResponse;
    console.log("Login response: ", data);

    if (data.payload) {
      return data.payload;
    }

    return null;
  }

  const onSignIn = (data: UseSignInData) => {
    console.log("User signed in: ", data);

    login(data.nonce, data.message as string, data.signature as `0x${string}`, data.fid as number, data.username as string).then((userData) => {

      if (userData) {
        const { username, pfp, jwt } = userData;
        setUsername(username);
        if (userData.farcasterUsername) {
          setDisplayName(userData.farcasterUsername);
        }
        setPfp(pfp);
        setJwt(jwt);
      }
    });
  };

  interface ChatClientConfig {
    apiKey: string;
    tokenOrProvider: string;
    userData: {
      id: string;
      name?: string;
      image?: string;
    };
  }

  const StreamWrapper = ({ config }: { config: ChatClientConfig }) => {
    console.log("StreamWrapper config: ", config);
    const client = useCreateChatClient(config);


    if (!client) {
      return <div>Loading chat...</div>;
    }

    const channel = client.getChannelById("livestream", "messaging", {});

    return (
      <Chat client={client}>
        <h4>{displayName || username}</h4>
        <Channel channel={channel}>
          <div className="chat-mangler">
            <MessageList />
            <MessageInput />
          </div>
        </Channel>
      </Chat>
    );
  };

  return (
    <AuthKitProvider config={optimismConfig}>
      <h1>Weeklyhackathon</h1>
      {pfp && <img src={pfp} alt="Profile picture" />}
      {chatClientConfig && <StreamWrapper config={chatClientConfig} />}
      <div>
      {!jwt && <SignInButton onSuccess={onSignIn} />  /* TODO handle the JWT expiring */ }
      </div>
   </AuthKitProvider>
  );
}

export default App;
