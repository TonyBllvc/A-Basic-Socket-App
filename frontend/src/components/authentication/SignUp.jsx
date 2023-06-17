import { 
     Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    // const [picture, setPicture] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const toast = useToast()

    const handleShowHide = () => {
        setShow(!show)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // add picture later 
        if(!name || !email || !password || !confirmPassword){
            toast({
               title: 'Please fill all the Fields!',
               status: 'warning',
               duration: 5000,
               isClosable: true,
               position: "bottom",
            })
            return
        }

        if( password !== confirmPassword ){
            toast({
               title: 'Passwords Do Not Match',
               status: 'warning',
               duration: 5000,
               isClosable: true,
               position: "bottom",
            })
            return
        }

        // add picture later 
        const details = { name, email, password, confirmPassword }

        try {
            const res = await fetch("api/user", {
                method: "POST",
                body: JSON.stringify(details),
                headers: {
                    "Content-Type": "application/json",
                }

            })
            const json = await res.json()

            if(!res.ok){
                toast({
                    title: 'Response not okay!',
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

    // // for the image upload handler
    //     const postDetails = (pictures) => {
    //         setLoading(true)
    //         if (pictures === undefined) {
    //             toast({
    //                 title: 'Please select an Image!',
    //                 status: 'warning',
    //                 duration: 5000,
    //                 isClosable: true,
    //                 position: "top-right",
    //             })
    //             return
    //         }

    //         if (pictures.type === 'image/jpeg' || pictures.type === 'image/png'){
    //              const data = new FormData()
    //              data.append('file', pictures)
    //              data.append('upload_preset', 'chat-app')
    //              data.append('cloud_name', '< add the name o your cloudinary account>')
    //              fetch('input url'{
    // method: 'post',
    // body: data
    // })
    // .then((res) => res.json())
    // .then((data) => 
    // setPicture(data.url.toString())
    // console.log(data.url.toString())
    // setLoading(false)
    // .catch((err) => {
    // console.log(err)
    // setLoading(false)
    // })
    // )
            // } else {
    //             toast({
    //                 title: 'Please select an Image!',
    //                 status: 'warning',
    //                 duration: 5000,
    //                 isClosable: true,
    //                 position: "bottom",
    //             })
    //  setLoading(false)
    //             return

            // }
    //    }

    return (
        <VStack spacing='5px' color='black' >
            <FormControl id='first-name' isRequired>
                <FormLabel color='black'>
                    Name:
                </FormLabel>
                <Input type='text' bg='green.100' placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl id='signup-email' isRequired>
                <FormLabel color='black'>
                    Email:
                </FormLabel>
                <Input type='text' bg='green.100' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl id='signup-password' isRequired>
                <FormLabel color='black'>
                    Password:
                </FormLabel>
                <InputGroup>

                    <Input type={show ? 'text' : 'password'} bg='green.100' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleShowHide}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirm-password' isRequired>
                <FormLabel color='black'>
                    Confirm Password:
                </FormLabel>
                <InputGroup>

                    <Input type={show ? 'text' : 'password'} bg='green.100' placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleShowHide}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            {/* <FormControl id='picture'>
                <FormLabel color='black'>
                    Upload Profile Picture:
                </FormLabel>
                <Input type='file' bg='green.100' placeholder='Profile picture' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl> */}

            <Button color='green.100' colorScheme='whatsapp' width='100%' style={{ marginTop: 15 }} onClick={handleSubmit} isLoading={loading} >
                Sign Up
            </Button>

        </VStack>
    )
}

export default SignUp
