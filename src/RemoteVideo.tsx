import { useEffect, useRef } from 'react';
import { SfuRoom } from 'skyway-js';

type Props = {
  stream: MediaStream;
  room: SfuRoom;
  onCloseRoom: () => void;
};
const RemoteVideo: React.VFC<Props> = ({ stream, room, onCloseRoom }) => {
  console.log({ stream });

  useEffect(() => {
    room.once('close', () => {
      if (videoElement.current) {
        (videoElement.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoElement.current.srcObject = null;
      }
      onCloseRoom();
    });
  }, [room]);

  const videoElement = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.srcObject = stream;
      videoElement.current.play().catch(console.error);
    }
  }, [stream]);

  return (
    <video
      data-peer-id={(stream as any).peerId}
      playsInline
      ref={videoElement}
      width="100%"
    />
  );
};

export { RemoteVideo };
