import { Box, Button, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import Peer, { SfuRoom } from 'skyway-js';

type Props = {
  messages: string[];
  room: SfuRoom;
  peer: Peer;
  onSendMessage: (message: string) => void;
};
const Chat: React.VFC<Props> = ({ messages, room, peer, onSendMessage }) => {
  const [chatText, setChatText] = useState('');

  const handleChangeChatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatText(e.target.value);
  };

  const handleClickSend = () => {
    room.send(chatText);
    onSendMessage(chatText);
    setChatText('');
  };

  return (
    <Box>
      <Box
        border="1px"
        borderColor="gray.300"
        padding="20px"
        maxHeight="350px"
        overflowY="scroll"
      >
        {messages.map((message, i) => (
          <Box key={`${message}-${i}`}>{message}</Box>
        ))}
        {messages.length === 0 && <Box>ここにチャットのログが表示されます</Box>}
      </Box>
      <Box display="flex" alignItems="center" marginTop="10px" gap="10px">
        <Input value={chatText} onChange={handleChangeChatInput} />
        <Button onClick={handleClickSend}>Send</Button>
      </Box>
    </Box>
  );
};

export { Chat };
