import { ViewIcon } from '@chakra-ui/icons'
// import { IconButton, Modal, ModalContent,ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from "../userAvatar/UserBadgeItem"
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast()

    const { selectedChat, setSelectedChat, user } = ChatState()

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd)) {
            toast({
                title: "User Already Added !",
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admin can add someone !",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false)
        }
    }

    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: "Only admin can remove someone !",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config);
            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false)
        }

    }


    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult()
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: "Failed to load the search results",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);

        }
    }

    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work Sans"
                        d="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        {/* Current Group members : */}
                        <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>
                        <FormControl d="flex">
                            <Input
                                placeholder="Enter updated name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add user to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size='lg' mt={3} />
                        ) : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModel