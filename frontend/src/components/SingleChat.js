import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
// import Lottie from "react-lottie"
// import animationData from "../assets/animations/typing.json"

const ENDPOINT = "http://127.0.0.1:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //         preserveAspectRatio: "xMidYMid slice",
    //     },
    // }

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const toast = useToast();


    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);


            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: "Failed To load the messages",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => {
            setSocketConnected(true)
        });

        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat;
        setNewMessage("")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                //chapri coder's logic
                // Give Notification
                // if (!notification.includes(newMessageReceived)) {
                //     setNotification([newMessageReceived, ...notification]);
                //     setFetchAgain(!fetchAgain);
                // }

                // our logic
                if (notification.length) {
                    let flag = false
                    notification.forEach((noti) => {
                        if (noti.chat._id === newMessageReceived.chat._id) {
                            flag = true
                            setFetchAgain(!fetchAgain);
                        }
                    })
                    if (!flag) {
                        setNotification([newMessageReceived, ...notification]);
                        setFetchAgain(!fetchAgain);
                    }
                } else {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }


            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    });

    const sendMessage = async (ev) => {
        if (ev.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("")

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                socket.emit("new message", data)
                setMessages([...messages, data])

                setFetchAgain(!fetchAgain)
            } catch (error) {
                toast({
                    title: "Error Occured !",
                    description: "Failed To send the message",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        // typing Incidicator logic
        if (!socketConnected) return;

        if (e.target.value === "") {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 1500;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff > timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work Sans"
                        d="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat()}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModel
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        d="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#f8f8f8"
                        // bg="#E9e9e9"
                        // bg="#075E54"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="scroll"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className='messages' style={{ display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none" }}>
                                <ScrollableChat isTyping={isTyping} messages={messages} />
                            </div>

                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {/* {isTyping ? <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    style={{ marginBottom: 10, marginLeft: 0 }}
                                />
                            </div> : <></>} */}
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Input
                                    variant="filled"
                                    width='auto'
                                    htmlSize={130.9}
                                    bg="#e0e0e0"
                                    _focus={{ bg: "#fff" }}
                                    _hover={{ bg: "#fff" }}
                                    placeholder="Enter a message..."
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </div>
                        </FormControl>
                        {/* <Icon as={MdSend} w={9} h={9} onClick={console.log("clicked")} color="#075E54" cursor="pointer" /> */}
                    </Box>
                </>
            ) : (
                <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
                        Click on a user/group to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat