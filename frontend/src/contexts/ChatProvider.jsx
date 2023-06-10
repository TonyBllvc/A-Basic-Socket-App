import React, { createContext, useContext, useEffect, useState } from 'react'

export const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
  const [user, setUser] = useState('')
  const [ selectedChat, setSelectedChat ] = useState('')
  const [ chats, setChats ] = useState([])
  // made use of useNavigation, but can not function
  // because it does not work inside a useContext 

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    setUser(userInfo)

    // if (!userInfo) {
    //   // navigate("/")
    // }
  }, [])
  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats  }}>
      {children}
    </ChatContext.Provider>

  )
}

export const ChatState = () => {
  const context = useContext(ChatContext)

  if(!context){
    throw Error('not assigned')
  }

  return context;
}
// export default ContextProvider
