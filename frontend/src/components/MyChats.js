import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get("/api/chat", config);
            // console.log(data);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: "Failed to load the chats",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain])


    // const remNotification = () => {

    //     notification.forEach((notif) => {

    //         if (selectedChat === notif.chat) {
    //             console.log("condition is true");
    //             setNotification(notification.filter((n) => n !== notif))
    //         }
    //         return ;
    //     })
    // }

    useEffect(() => {
        if (selectedChat) {
            notification.forEach((notif) => {
                if (selectedChat._id === notif.chat._id) {
                    setNotification(notification.filter((n) => n !== notif))
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);

    return (
        <Box
            d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work Sans"
                d="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        d="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                        borderRadius="3xl"
                    >
                        Create Group
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                d="flex"
                flexDir="column"
                p={3}
                bg="#f8f8f8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map(chat => (
                            <Box
                                onClick={() => {
                                    setSelectedChat(chat)
                                    setFetchAgain(!fetchAgain)
                                }}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#a557ff" : "#e8e8e8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            // _hover={{ bg: "#d6d6d6" }}

                            >
                                <Text fontSize='lg'>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                </Text>
                                <Text fontSize='md'>
                                    {chat.latestMessage && (
                                        <>
                                            <strong>
                                                {chat.latestMessage.sender.name === user.name ? "You" : chat.latestMessage.sender.name} :
                                            </strong>
                                            <span>
                                                - {chat.latestMessage.content}
                                            </span>
                                        </>
                                    )}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box >
    )
}

export default MyChats