import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Spinner, useToast, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FaTimes } from 'react-icons/fa'
// import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvata/UserListItem'
import { ChatState } from '../../contexts/ChatProvider'

const SearchBar = ({ toggle, set, search, setSearch, handleSearch, loading, searchResult, setLoadingChat, loadingChat, setSelectedChat }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, chats, setChats } = ChatState()
    const toast = useToast()

    const accessChat = async (userId) => {
        // preventDefault()
        // **************************
        try {
            setLoadingChat(true)
            // const config = {
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${user.token}`,
            //     },
            // }
            // const { data } = await axios.post('/api/chat', { userId }, config)


            const data = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({userId}),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },

            }
            )

            // const json = JSON.stringify(data)
            const json = await data.json()

            // check if chat exists
            const chatCheck = (!chats.find((c) => c._id === json._id))

            // if chat exists, pass the given chat
            if (chatCheck) {
                setChats([json, ...chats])
            }
            setSelectedChat(json)
            setLoadingChat(false)
            set(!toggle)
        } catch (error) {
            toast({
                title: 'Error fetching the chat!',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            })

        }
    }
    // ********************************

    return (
        <div >
            <Drawer placement='left' onClose={onClose} isOpen={onOpen} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader display='flex' flexDirection='row' justifyContent='space-between' fontSize='33px' borderBottomWidth='1px'>
                        Search Users
                        <FaTimes size='24px' className='hover:text-red-600' onClick={() => set(!toggle)} />
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={2} >
                            <Input type='text' placeholder='Search my name or email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button bg='green.500' colorScheme='green' onClick={handleSearch} > Go </Button>
                        </Box>

                        {/* The loading chats section */}
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}

                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </div>
    )
}

export default SearchBar
