import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-react';
import { type Channel as StreamChannel } from 'stream-chat';

const LivestreamChat = ({
  channel,
  displayName,
  username,
}: {
  channel: StreamChannel | null;
  displayName: string | null;
  username: string;
}) => {
  if (!channel) {
    return null;
  }

  return (
    <Chat client={channel.getClient()}>
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

export default LivestreamChat;
