import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../../contexts/ChatProvider'

const Login = () => {
    const [show, setShow] = useState(false)
    // to disable input / and
    const [readOnly, setReadOnly] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { user } = ChatState()

    const toast = useToast()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // add picture later 
        if (!email || !password) {
            toast({
                title: 'Please fill all the Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return
        }
        // add picture later 
        const details = { email, password }

        try {
            const res = await fetch("api/user/login", {
                method: "POST",
                body: JSON.stringify(details),
                headers: {
                    "Content-Type": "application/json",
                }

            })

            const json = await res.json()

            if(!res.ok){
                toast({
                    title: 'An Error Occurred!',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                })
                console.log(json.error)

            }

            if(res.ok){
                toast({
                    title: 'Login Successful!',
                    description: email + ' logged in successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                })
                localStorage.setItem('userInfo', JSON.stringify(json))
                setLoading(false)
                navigate('/chats')
            }
        } catch (error) {
            toast({
                title: 'An Error Occurred!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            setLoading(false)
        }

    }

    const handleShowHide = () => {
        setShow(!show)
        // this i so the password is not changed
        // setGuestShow(guestShow)
    }

    const handleGuest = (e) => {
        setEmail('guest@example.com')
        setPassword('logmeIn576')
        setReadOnly(true)
    }

    const removeGuest = () => {
        setEmail('')
        setPassword('')
        setReadOnly(false)

    }
    return (
        <VStack spacing='5px' color='black' >

            <FormControl id='login-email' isRequired>
                <FormLabel color='black'>
                    Email:
                </FormLabel>
                <Input type='text' bg='green.100' placeholder='Enter your email' value={email } onChange={(e) => setEmail(e.target.value)} isReadOnly={readOnly} />
            </FormControl>

            <FormControl id='login-password' isRequired>
                <FormLabel color='black'>
                    Password:
                </FormLabel>
                <InputGroup>

                    <Input type={show && !readOnly ? 'text' : 'password'} bg='green.100' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} isReadOnly={readOnly} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleShowHide}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            {/* Button for Log in */}
            <Button color='green.100' colorScheme='whatsapp' width='100%' style={{ marginTop: 15 }} onClick={handleSubmit} isLoading={loading} >
                Login
            </Button>

            {/* Input for Guest Login  */}
            {!readOnly ? (
                <Button variant='solid' color='beige' colorScheme='teal' width='100%' style={{ marginTop: 15 }} onClick={handleGuest} >
                    Get Guest User Credentials
                </Button>
            ) : (
                <Button variant='solid' color='blackAlpha.700' colorScheme='whiteAlpha' width='100%' style={{ marginTop: 15 }} onClick={removeGuest} >
                    Clear Guest User Credentials
                </Button>
            )
            }

        </VStack>
    )

}

export default Login
