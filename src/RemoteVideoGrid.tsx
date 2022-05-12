import { Box, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { SfuRoom } from 'skyway-js';
import { RemoteVideo } from './RemoteVideo';

type Props = {
  room: SfuRoom;
  remoteStreams: MediaStream[];
  handleCloseRoom: () => void;
};
const RemoteVideoGrid: React.VFC<Props> = ({
  room,
  remoteStreams,
  handleCloseRoom,
}) => {
  return (
    <SimpleGrid columns={2} spacing={10}>
      {remoteStreams.map((stream) => (
        <Box key={stream.id}>
          <RemoteVideo
            stream={stream}
            room={room}
            onCloseRoom={handleCloseRoom}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export { RemoteVideoGrid };
