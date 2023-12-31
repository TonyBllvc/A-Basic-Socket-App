import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaBell, FaChevronDown, FaSearch } from 'react-icons/fa'
import { ChatState } from '../../contexts/ChatProvider'
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { getSender } from '../../config/chatLogics'

const ChatNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState('')
  const [toggle, setToggle] = useState(false)
  const toast = useToast()

  const { user, setSelectedChat, notification, setNotification } = ChatState()

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
    toast({
      title: 'Logout Successful!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: "top",
    })
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please, enter something first!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
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

  return (
    <div>
      <Box display='flex' justifyContent='space-between' alignItems='center' bg='white' w='100%' p='5px 10px 5px 10px' borderWidth='5px' >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={() => setToggle(!toggle)}  >
            <FaSearch type='button' className=' text-red-600 text-lg font-thin' />
            <Text display={{ base: "none", md: "flex" }} px='4' > Search User </Text>
          </Button>
        </Tooltip>

        <Text fontSize='2xl' fontFamily='work sans'>
          Talk App
        </Text>

        <div className=' flex align-middle justify-center'>
          <Menu>
            <MenuButton p={1} display='flex' justifyContent='center'>
              <div className='flex flex-row'>
                {/* <BellIcon */}
                {notification.length >= 1 ? (

                  <div className='flex flex-row justify-center items-center'>
                    <FaBell type='button' className=' text-black text-lg font-thin -mr-2.5' />
                    <div className='text-sm -mt-5 text-white rounded-xl px-1 bg-red-700 font-semibold'>
                      {notification.length}
                    </div>
                  </div>

                ) : (
                  <div className='mr-4'>
                  <FaBell type='button' className=' text-black text-lg m-1 font-thin -mr-3' />
                  </div>
                )
                }
              </div>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && 'No new messages '}
              {notification.map(notify => (
                <MenuItem key={notify._id} onClick={() => {
                  setSelectedChat(notify.chat_owner)
                  setNotification(notification.filter((n) => n !== notify))
                }}>
                  {notify.chat_owner.isGroupChat ?
                    `New message in ${notify.chat_owner.chat_name}`
                    :
                    `New Message from ${getSender(user, notify.chat_owner.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown className='text-sm ' />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.picture} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen} > My Profile </MenuItem>
              {/* A component that handles Profile section*/}
              <ProfileModel user={user} open={isOpen} close={onClose} />

              <MenuDivider />
              <MenuItem onClick={logoutHandler}> Logout </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* A component the handles the search bar side widgets */}
      {toggle &&
        <SearchBar toggle={toggle} set={setToggle} setSearch={setSearch} search={search} handleSearch={handleSearch} loading={loading} searchResult={searchResult} setLoadingChat={setLoadingChat} loadingChat={loadingChat} setSelectedChat={setSelectedChat} />
      }
    </div>
  )
}

export default ChatNav
