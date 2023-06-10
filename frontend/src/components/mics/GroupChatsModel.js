import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Toast, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import UserListItem from '../UserAvata/UserListItem'
import UserBadgeItem from '../UserAvata/UserBadgeItem'
import axios from 'axios'

const GroupChatsModel = ({ user, setChats, chats, open, close }) => {
  const [groupChatName, setGroupChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  

  const toast = useToast()

  const handleSearch = async (query) => {

    if (!query) {
      return
    }
    // if(query.length == null ){
    //   setGroupChatName('')
    //   setSearch('')
    //   setSearchResult([])

    // }


    if (query.length >= 1) {
      setSearch(query)

      try {
        setLoading(true)

        const data = await fetch(`/api/user?search=${search}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        }
        )
        const json = await data.json()

        console.log(json)
        setLoading(false)
        setSearchResult(json)
      } catch (error) {
        toast({
          title: 'Error Occurred!',
          description: 'Failed to load the User Search Results for Group',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "top",
        })

      }
    }

  }

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      Toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      return
    }

    try {
      // const selected = selectedUsers.map((u) => u._id )

      // const details = { name: groupChatName, users: selected }

      // const data = await fetch('/api/chat/group', {
      //     method: 'POST',
      //     body: JSON.stringify(details),
      //     headers: {
      //         "Content-Type": "application/json",
      //         "Authorization": `Bearer ${user.token}`,
      //     },

      // })
      
      // const json = await data.json()

      // setChats([json, ...chats])

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }

      const { data } = await axios.post('/api/chat/group', {
        name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id ))
      }, config 
      )

      setChats([data, ...chats])
      close()
      toast({
        title: 'Group Chat created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    } catch (error) {
      toast({
        title: 'Failed to create group chat',
        description: error.response.data,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      
    }
  }
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter(val => val._id !== delUser._id))
  }

  const handleGroup = (userToAdd) => {

    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      return
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  const clearValue = (delUser) => {
    setGroupChatName('')
    setSearch('')
    setSearchResult([])
  }

  return (
    <>
      <Modal size='lg' isCentered isOpen={open} onClose={close}  >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='40px' fontFamily='Work sans' display='flex' justifyContent='center'>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton onClick={clearValue} />
          <ModalBody fontSize='40px' fontFamily='work sans' display='flex' justifyContent='space-between' flexDirection='column' alignItems='center'>

            <FormControl>
              <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>

            <FormControl>
              <Input placeholder='Add Users eg: John, Mag' mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            <Box w='100%' display='flex' flexWrap='wrap' >
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Box>

            {loading ? (
              <Spinner ml='auto' display='flex' />
            ) : (
              searchResult?.slice(0, 4).map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )
            }

          </ModalBody> 

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
            <Button variant='ghost' > Secondary Action </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatsModel
