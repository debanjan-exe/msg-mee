import React, { useState } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const history = useHistory();
    const { setUser } = ChatState();

    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an image1',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "msg-me");
            data.append("cloud_name", "debanjan");
            fetch("https://api.cloudinary.com/v1_1/debanjan/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    // console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
        else {
            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: "Password doesn't match",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user",
                { name, email, password, pic },
                config
            );
            toast({
                title: "Registration Successfull",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            setUser(userInfo)
            setLoading(false);
            history.push("/chats")
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    const sendLoginReq = (event) => {
        if (event.key === "Enter") {
            submitHandler()
        }
    }

    return <VStack spacing="5px" color="black">
        <FormControl id="first-name" isRequired onKeyDown={sendLoginReq}>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder='Enter your name'
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
            />
        </FormControl>

        <FormControl id="S-email" isRequired onKeyDown={sendLoginReq}>
            <FormLabel>Email</FormLabel>
            <Input
                type="email"
                placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
            />
        </FormControl>

        <FormControl id="S-password" isRequired onKeyDown={sendLoginReq}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text" : "password"}
                    placeholder='Enter your Password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="C-password" isRequired onKeyDown={sendLoginReq}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text" : "password"}
                    placeholder='Confirm Password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="pic" isRequired>
            <FormLabel>Upload profile pic</FormLabel>
            <Input
                type="file"
                p={1.5}
                accept="image/*"
                placeholder='Enter your Email'
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>;
}
export default SignUp;