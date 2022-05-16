import { Box, Button, Container, Heading, Input } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import Peer, { RoomStream, SfuRoom } from 'skyway-js';
import { Chat } from './Chat';
import { RemoteVideoGrid } from './RemoteVideoGrid';

function App() {
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<RoomStream[]>([]);
  const [room, setRoom] = useState<SfuRoom | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((localStream) => {
        localStreamRef.current = localStream;

        if (localVideo.current) {
          localVideo.current.muted = true;
          localVideo.current.srcObject = localStream;
          localVideo.current.play().catch(console.error);
        }
      })
      .catch(console.error);

    const peer = new Peer({
      key: import.meta.env.VITE_SKYWAY_API_KEY,
      debug: 3,
    });
    setPeer(peer);
  }, []);

  const handleChangeRoomNameInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRoomName(e.target.value);
  };

  const handleClickJoin = () => {
    if (!peer?.open) {
      return;
    }

    if (!localStreamRef.current) {
      return;
    }

    const room = peer.joinRoom(roomName, {
      mode: 'sfu',
      stream: localStreamRef.current,
    });

    setRoom(room);

    room.once('open', () => {
      setMessages((v) => [...v, '=== You joined ===']);
    });

    room.on('peerJoin', (peerId) => {
      setMessages((v) => [...v, `=== ${peerId} joined ===`]);
    });

    room.on('stream', async (stream) => {
      setRemoteStreams((v) => [...v, stream]);
    });

    room.on('data', ({ data, src }) => {
      setMessages((v) => [...v, `${src}: ${data}`]);
    });

    room.on('peerLeave', (peerId) => {
      const remoteVideo = document.querySelector(
        `[data-peer-id="${peerId}"]`
      ) as HTMLVideoElement | null;
      if (remoteVideo && remoteVideo.srcObject) {
        (remoteVideo.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        remoteVideo.srcObject = null;
      }

      const newStreams = remoteStreams.filter(
        (v) => (v as any).peerId !== peerId
      );
      setRemoteStreams(newStreams);
      setMessages((v) => [...v, `=== ${peerId} left ===`]);
    });
  };

  const handleClickLeave = () => {
    if (room) {
      room.close();
      setRoomName('');
    }
  };

  const handleCloseRoom = () => {
    setRoom(null);
    setMessages((v) => [...v, '== You left ===']);
    setRemoteStreams([]);
  };

  return (
    <Container maxW="container.lg">
      <Heading textAlign="center" marginTop="20px">
        Skyway Video Meeting
      </Heading>
      <Box
        display="flex"
        gap="10px"
        marginTop="40px"
        justifyContent="space-between"
        alignItems="end"
      >
        <Box>
          <Box>
            <video width="400px" autoPlay muted playsInline ref={localVideo} />
          </Box>
          <Box display="flex" alignItems="center" gap="10px" marginTop="10px">
            <Input
              placeholder="room name"
              value={roomName}
              onChange={handleChangeRoomNameInput}
            />
            <Button
              onClick={handleClickJoin}
              disabled={remoteStreams.length !== 0}
            >
              Join
            </Button>
            <Button onClick={handleClickLeave}>Leave</Button>
          </Box>
        </Box>
        <Box>
          {room && peer && (
            <Chat
              messages={messages}
              room={room}
              peer={peer}
              onSendMessage={(message) =>
                setMessages((v) => [...v, `${peer.id}: ${message}`])
              }
            />
          )}
        </Box>
      </Box>
      <Box marginTop="80px">
        {room && (
          <RemoteVideoGrid
            room={room}
            remoteStreams={remoteStreams}
            handleCloseRoom={handleCloseRoom}
          />
        )}
      </Box>
    </Container>
  );
}

export default App;
