import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
// import { ChatIcon } from '@chakra-ui/icons';
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';
import { useHistory } from 'react-router-dom';

const Homepage = () => {

    const history = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) {
            history.push("/chats");
        }

    }, [history]);


    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={1}
                bg={"#fbfbfb"}
                w="100%"
                m="20px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                boxShadow='dark-lg'
            >
                <Text fontSize="4xl" fontFamily="Work Sans" color="black">msg.me</Text>
            </Box>
            <Box
                bg="#fbfbfb"
                width="100%" p={2}
                borderRadius="lg"
                borderWidth="1px"
                color="black"
                boxShadow='dark-lg'
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
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
        </Container>
    )
}

export default Homepage