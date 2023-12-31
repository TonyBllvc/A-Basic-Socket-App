import React from 'react'
// import { ChatState } from '../../contexts/ChatProvider'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({ user, handleFunction }) => {
  // const { user } = ChatState()

  return (
    <Box onClick={handleFunction} cursor='pointer' bg='#e8e8e8' _hover={{ background: 'green.500', color: 'white' }} w='100%' display='flex' alignItems='center' color='black' px={3} py={2} mb={2} borderRadius='lg' >
      <Avatar mr={2} size='sm' cursor='pointer' name={user.name} src={user.picture} />
      <Text > {user.name} </Text>
      <Text fontSize='xs'>
        <b> Email : </b>
        {user.email}
      </Text>
    </Box>
  )
}

export default UserListItem
