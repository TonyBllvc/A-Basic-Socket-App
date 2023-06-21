import React, { useEffect, useState } from 'react'
// import { ChatState } from '../contexts/ChatProvider'
import { Box, Button, FormControl, Input, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { FaArrowLeft, FaEnvelope, FaEye } from 'react-icons/fa'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModel from './mics/ProfileModel'
import axios from 'axios'
import UpdateGroupChatModel from './mics/UpdateGroupChatModel'
import ScrollableChat from './ScrollableChat'
// ******************************Socket IO ****************
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;
// ****************************************************

const SingleChat = ({ user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const { user, selectedChat, setSelectedChat } = ChatState()
    // ****************************Single message ***************
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)

    const toast = useToast()
    
// ******************************Socket IO ****************
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connection", () => {
            setSocketConnected(true)
        })
    }, [])
    // ****************************************************************

    const fetchMessages = async () => {
        if (!selectedChat) {
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            setLoading(true)
            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            )

            setMessages(data)
            setLoading(false)

            // ******************************Socket IO ***************
            socket.emit("join_chat", selectedChat._id)
            // ****************************************************
        } catch (error) {
            toast({
                title: 'Error Occurred!',
                description: "Failed to send the message",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
    }

    useEffect(() => {
        fetchMessages()

        // ******************************Socket IO ***************
        // a sort of backup for the selectedChat
        selectedChatCompare = selectedChat
        // *********************************************************
    }, [selectedChat])


    const sendMessage = async (event) => {
        // If Enter is clicked, and there is a message in the box
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    }
                }

                setNewMessage('')
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    }, config
                )

                console.log(data)

                socket.emit("new_message", data)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: 'Error Occurred!',
                    description: "Failed to send the message",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                })

            }
        }
    }

    // ******************************Socket IO ***************

    useEffect(() => {
        socket.on("message_received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification
            } else {
                setMessages(...messages, newMessageReceived)
            }
        })
    })
    // *****************************************************************

    const clickMessage = async (event) => {
        // If Enter is clicked, and there is a message in the box

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }

            setNewMessage('')
            const { data } = await axios.post(
                "/api/message",
                {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config
            )

            setMessages([...messages, data])
        } catch (error) {
            toast({
                title: 'Error Occurred!',
                description: "Failed to send the message",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            })

        }

    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        //Typing Indicator Logic
    }

    // *********************************************************

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text fontSize={{ base: '28px', md: '30px' }} pb={3} px={2} w='100%' fontFamily='Work sans' display='flex' justifyContent={{ base: 'space-between' }} alignItems='center' >
                            <FaArrowLeft size='24px' className='text-lg text-black ' onClick={() => setSelectedChat('')} />

                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <FaEye type='button' className=' text-red-600 text-lg m-1 font-thin' onClick={onOpen} />
                                    <ProfileModel open={isOpen} close={onClose} user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {/* //*********** Single Chat(small props drill done, take note )  */}
                                    {/* //********** fetchMessage function was passed, write down */}
                                    {selectedChat.chat_name.toUpperCase()}
                                    <UpdateGroupChatModel setSelectedChat={setSelectedChat} selectedChat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} fetchMessages={fetchMessages} />
                                    {/* //**************************** */}
                                </>
                            )}
                        </Text>
                        <Box display='flex' flexDirection='column' justifyContent='flex-end' p={3} bg='#e8e8e8' w='100%' h='100%' borderRadius='lg' overflowY='hidden' >
                            {loading ? (
                                <Spinner size='xl' w={20} h={20} alignSelf='center' margin='auto' />
                            ) : (
                                <div className='flex flex-col overflow-y-scroll  ' >

                                    <ScrollableChat user={user} messages={messages} />
                                </div>
                            )
                            }

                            {/* //*****************Single Chats **********************  */}
                            {/* //*****************UI Starts here**********************  */}
                            <Box display='flex' flexDirection='row' justifyContent='space-around' alignItems='center' alignContent='center' p={3} bg='#e8e8e8' w='100%' >
                                <FormControl onKeyDown={sendMessage} mr={1} isRequired mt={3} >
                                    <Input variant='filled' bg='gray.300' placeholder='Enter a message' onChange={typingHandler} value={newMessage} />
                                </FormControl>
                                <Button onClick={clickMessage} colorScheme='green' p={2} mt={3} ml={2} >
                                    <FaEnvelope className='test-sm text-white ' />
                                </Button>
                            </Box>

                            {/* //*****************Ends here**********************  */}
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
