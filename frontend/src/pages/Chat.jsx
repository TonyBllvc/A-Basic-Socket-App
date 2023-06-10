import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../contexts/ChatProvider'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'
import ChatNav from '../components/mics/ChatNav'

const Chat = () => {
  const { user } = ChatState()
  const navigate = useNavigate()
  const [ fetchAgain, setFetchAgain ] = useState('')

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (!userInfo) {
      navigate("/")
    }
  }, [navigate])

  return (
    <div style={{ width: "100%" }}>
      {user &&
        <ChatNav />
      }
      <Box w='100%' display='flex' justifyContent='space-between' h='91.5vh' bg='blue.200' >
      
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default Chat
