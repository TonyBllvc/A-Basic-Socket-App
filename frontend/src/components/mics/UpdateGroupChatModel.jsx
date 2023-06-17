import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import UserBadgeItem from '../UserAvata/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvata/UserListItem'

//**************************** fetchMessages was picked up from drill ********************* */
const UpdateGroupChatModel = ({ user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain, fetchMessages }) => {
  // *******************************************************
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState('')
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const toast = useToast()

  const handleRemove = async (user1) => {

    if ((selectedChat.groupAdmin._id !== user._id) && (user1._id !== user._id)) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      return
    }
    
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }

      const { data } = await axios.put('/api/chat/remove_user', {
        chatId: selectedChat._id,
        userId: user1._id,
      }, config
      )

      // if user left group chat 
      // return empty chat
      user1._id === user._id ? setSelectedChat('') : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      // ************** prop passed  ******************
      fetchMessages()
      // ***********************************************
      setLoading(false)

    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      setLoading(false)


    }


  }

  const handleRename = async () => {
    if (!groupChatName) {
      return
    }

    try {
      setRenameLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }

      const { data } = await axios.put('/api/chat/rename', {
        chat_name: groupChatName,
        chatId: selectedChat._id,
      }, config
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)

    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      setRenameLoading(false)

    }
    setGroupChatName('')
  }


  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return
    }

    try {
      setLoading(true)

      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   }
      // }

      // const data = await fetch(`/api/user?search=${search}`, config ) 

      const data = await fetch(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
      )
      const json = await data.json()

      setLoading(false)
      setSearchResult(json)
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to load the User Search Results for users',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      console.log(error.message)
      setLoading(false)
    }


  }

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User already added!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }

      const { data } = await axios.put('/api/chat/add_user', {
        chatId: selectedChat._id,
        userId: user1._id,
      }, config
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      setLoading(false)


    }
  }


  return (
    <>
      <FaEye type='button' className=' sm:flex text-red-600 text-lg m-1 font-thin' onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='35px' fontFamily='Work sans' display='flex' justifyContent='center' > {selectedChat.chat_name} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            {/* User information */}
            <Box w='100%' display='flex' flexWrap='wrap' pb={3} >
              {selectedChat.users.map(u => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />

              ))}
            </Box>

            <FormControl display='flex'>
              <Input placeholder='Chat Name' mb={3.5} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />

              <Button variant='solid' colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename} > Update </Button>
            </FormControl>
            <FormControl>
              <Input placeholder='Add User to Group' md={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult?.slice(0, 4).map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel
