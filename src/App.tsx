import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider, UseSignInData, SignInButton } from '@farcaster/auth-kit';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useState } from 'react';
import './App.css';
import { useStore } from './store/useStore';
import { DefaultGenerics, StreamChat, type Channel as StreamChannel } from "stream-chat";


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

const apiKey = import.meta.env.VITE_GETSTREAM_API_KEY;

const chatClient = StreamChat.getInstance(apiKey, {
  timeout: 6000,
});

function App() {

  const { name: username, setName: setUsername, jwt: jwt, setJwt: setJwt, pfp: pfp, setPfp: setPfp, displayName, setDisplayName } = useStore();
  const [channel, setChannel] = useState<StreamChannel<DefaultGenerics> | null>(null);

  const nativeLogin = async (nonce: string, message: string, signature: string, fid: number, username: string) => {
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

  const onFarcasterSignIn = (data: UseSignInData) => {
    console.log("User signed in: ", data);
    if (!data.nonce || !data.message || !data.signature || !data.fid || !data.username) {
      console.error("Invalid sign in data");
      return;
    }

    nativeLogin(data.nonce, data.message, data.signature, data.fid, data.username).then((userData) => {

      if (userData) {
        const { username, pfp, jwt } = userData;
        setUsername(username);
        if (userData.farcasterUsername) {
          setDisplayName(userData.farcasterUsername);
        }
        setPfp(pfp);
        setJwt(jwt);

        const userRequestData: Record<string, string> = {
          id: username as string,
          name: (displayName || username) as string,
        };
        if (pfp) {
          userRequestData.image = pfp;
        }

        chatClient.connectUser(
          userRequestData as any,
          jwt,
        ).then(() => {
          console.log("User connected, connecting to chat channel");
          const channel = chatClient.getChannelById("livestream", "messaging", {});
          setChannel(channel);
        })
        .catch((error) => {
          console.error("Error connecting user: ", error);
        });
      }
    });
  };

  const StreamChat = () => {
    if (!channel) {
      return null;
    }

    return (
      <Chat client={chatClient}>
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

  if (jwt) {
    const userData:Record<string, string> = {
      id: username,
      name: displayName || username,
    };
    if (pfp) {
      userData.image = pfp;
    }
    chatClient.connectUser(
      userData as any,
      jwt,
    ).then(() => {
      console.log("User connected, connecting to chat channel");
      const channel = chatClient.getChannelById("livestream", "messaging", {});
      setChannel(channel);
    })
    .catch((error) => {
      console.error("Error connecting user: ", error);
    });
  }

    return (
      <AuthKitProvider config={optimismConfig}>
      <h1>Weeklyhackathon</h1>
      {pfp && <img src={pfp} alt="Profile picture" />}
      <StreamChat />
      <div>
      {!jwt && <SignInButton onSuccess={onFarcasterSignIn} />  /* TODO handle the JWT expiring */ }
      </div>
   </AuthKitProvider>
  );
}

export default App;
