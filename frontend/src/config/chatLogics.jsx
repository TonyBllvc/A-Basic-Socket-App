import React from 'react'

export const getSender = (loggedUser, users) => {
  // for private chats ( single user chats)
  // for every users' array, if the first user in the array is ...
  // .. the logged in user id, parse the name o the second user...
  // .. else, return first user
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0]
}

