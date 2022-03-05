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

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const history = useHistory();
    const { setUser } = ChatState();

    const handleClick = () => setShow(!show)

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
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
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user/login", { email, password }, config);
            toast({
                title: "Login Successfull",
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
                // description: error.response.data.message,
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

        <FormControl id="email" isRequired onKeyDown={sendLoginReq}>
            <FormLabel>Email</FormLabel>
            <Input
                type="email"
                value={email}
                placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
            />
        </FormControl>

        <FormControl id="password" isRequired onKeyDown={sendLoginReq}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text" : "password"}
                    value={password}
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

        <Button
            colorScheme="green"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
        >
            Login
        </Button>
        <Button
            variant="solid"
            colorScheme="red"
            width="100%"
            onClick={() => {
                setEmail("guest@email.com");
                setPassword("123456")
            }}
        >
            Get Guest User Credentials
        </Button>
    </VStack>;
}

export default Login