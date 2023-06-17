import React from 'react'

const ScrollableChat = ({ messages }) => {
  return (
    <ScrollableFeed>
       { messages && messages.map( (m, i) => {
        
       })} 
    </ScrollableFeed>
  )
}

export default ScrollableChat
