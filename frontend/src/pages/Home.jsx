import { Box, Button, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (userInfo) {
      navigate("/chats")
    }
  }, [navigate])
  return (
    <Container maxW='xl' centerContent >
      <Box d='flex' justifyContent='center' textAlign='center' p={3} bg='white' w='100%' m='40px 0 15px 0' borderRadius='lg' borderWidth='1px' >
        <Text fontSize='4xl' fontFamily='work sans' color='black' >
          Talk-A-Tive
        </Text>
        <Box bg='whatsapp.300' w='100%' p={4} color='black' borderRadius="lg" borderWidth="1px" >
          <Tabs variant='soft-rounded' colorScheme="yellow" >
            <TabList mb='1em'>
              <Tab width='50%'> Log in</Tab>
              <Tab width='50%'> Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>

    </Container>
  )
}

export default Home
