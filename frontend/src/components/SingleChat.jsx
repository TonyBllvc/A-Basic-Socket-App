import React from 'react'
import { ChatState } from '../contexts/ChatProvider'
import { Box, Text, useDisclosure } from '@chakra-ui/react'
import { FaArrowLeft, FaEye } from 'react-icons/fa'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModel from './mics/ProfileModel'
import UpdateGroupChatModel from './mics/UpdateGroupChatModel'

// ***************************** Chat Interface ******************
const SingleChat = ({ user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const { user, selectedChat, setSelectedChat } = ChatState()

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text fontSize={{ base: '28px', md: '30px' }} pb={3} px={2} w='100%' fontFamily='Work sans' display='flex' justifyContent={{ base: 'space-between' }} alignItems='center' >
                            <FaArrowLeft size='24px' className='text-lg text-black ' onClick={() => setSelectedChat('')} />

                            {/* This piece of code has a slight fault */}
                            {/* //*****************Starts here**********************  */}
                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <FaEye type='button' className=' text-red-600 text-lg m-1 font-thin' onClick={onOpen} />
                                    <ProfileModel open={isOpen} close={onClose} user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chat_name.toUpperCase()}
                                    <UpdateGroupChatModel setSelectedChat={setSelectedChat} selectedChat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} />
                                </>
                            )}
                            {/* //********************Ends here *******************  */}
                        </Text>
                        <Box display='flex' flexDirection='column' justifyContent='flex-end' p={3} bg='#e8e8e8' w='100%' h='100%' borderRadius='lg' overflowY='hidden' >

                        </Box>
                    </>
                ) : (
                    <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                        <Text fontSize='3xl' pb={3} fontFamily="Work sans" >
                            Click on a user to start chat
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat
