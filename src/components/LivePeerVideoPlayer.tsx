import { PauseIcon, PlayIcon } from '@livepeer/react/assets';
import * as Player from '@livepeer/react/player';
import { Src } from '@livepeer/react';
import { Livepeer } from 'livepeer';
import { getSrc as getLivepeerSrc } from '@livepeer/react/external';

const livepeer = new Livepeer({
  apiKey: import.meta.env.VITE_LIVEPEER_API_KEY,
});

const LivePeerVideoPlayer = ({ src }: { src: Src[] | null }) => {
  if (!src) return null;

  return (
    <Player.Root src={src}>
      <Player.Container>
        <Player.Video title="Live stream" />

        <Player.Controls className="flex items-center justify-center">
          <Player.PlayPauseTrigger className="w-10 h-10">
            <Player.PlayingIndicator asChild matcher={false}>
              <PlayIcon />
            </Player.PlayingIndicator>
            <Player.PlayingIndicator asChild>
              <PauseIcon />
            </Player.PlayingIndicator>
          </Player.PlayPauseTrigger>
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  );
};

export const getPlaybackSource = async () => {
  const playbackInfo = await livepeer.playback.get(
    import.meta.env.VITE_LIVEPEER_PLAYBACK_ID
  );

  const src = getLivepeerSrc(playbackInfo.playbackInfo);

  return src;
};

export default LivePeerVideoPlayer;
