import React from 'react'
import { ChatState } from '../contexts/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

// ***************************** Chat Interface ******************
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState()

  return (
    <Box display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }} alignItems='center' flexDirection='column' p={3} bg='white' w={{ base: '100%', md: '65%' }} borderRadius='lg' borderWidth='1px' >
      <SingleChat user={user} selectedChat={selectedChat} setSelectedChat={setSelectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox;
