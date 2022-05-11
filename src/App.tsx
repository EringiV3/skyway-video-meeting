import { Box, Button, Container, Heading, Input } from '@chakra-ui/react';

function App() {
  return (
    <Container maxW="container.lg">
      <Heading textAlign="center">Room example</Heading>
      <Box
        display="flex"
        gap="10px"
        marginTop="40px"
        justifyContent="space-between"
      >
        <Box>
          <Box>
            <video width="400px" autoPlay muted playsInline />
          </Box>
          <Box display="flex" alignItems="center" gap="10px">
            <Input placeholder="room name" />
            <Button>Join</Button>
            <Button>Leave</Button>
          </Box>
        </Box>
        <Box>remote rooms</Box>
        <Box>
          <Box>messages</Box>
          <Box display="flex" alignItems="center">
            <Input />
            <Button>Send</Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
