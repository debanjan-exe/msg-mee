import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import UserListItem from '../userAvatar/UserListItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setSelectedChat, setChats } = ChatState()

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
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields !",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);

            setChats([data, ...chats]);
            setSelectedChat(data);

            //reset GroupChatmodal to empty
            setSearch("")
            setGroupChatName()
            setSelectedUsers([])
            setSearchResult([])

            onClose();

            toast({
                title: "Group Created",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            // console.log(error);
            toast({
                title: "Failed to create group !",
                description: error.response.data.message,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }

    const handleGroup = (userToAdd) => {

        //Rishi's Logic

        let userFound = false
        // console.log(userToAdd)
        selectedUsers.map((suser) => {
            if (suser._id === userToAdd._id) {
                toast({
                    title: "User Already Chosen !",
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                });
                userFound = true
                return null;
            }
            return null;
        })
        if (!userFound) {
            setSelectedUsers([...selectedUsers, userToAdd])
        }

        //Chapri Coder's Logic

        // if (selectedUsers.includes(userToAdd)) {
        //     toast({
        //         title: "User Already Chosen !",
        //         status: 'warning',
        //         duration: 2000,
        //         isClosable: true,
        //         position: "top",
        //     });
        // } else {
        //     setSelectedUsers([...selectedUsers, userToAdd])
        // }

    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={() => {
                onClose()
                setGroupChatName()
                setSelectedUsers([])
                setSearchResult([])
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={{ base: "29px", md: "35px" }}
                        fontFamily="Work Sans"
                        d="flex"
                        justifyContent="center"
                        pt={{ base: "10", md: "7" }}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton
                    // onClick={() => {
                    //     onClose()
                    //     setGroupChatName()
                    //     setSelectedUsers([])
                    //     setSearchResult([])
                    // }} 
                    />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder='Name of the Group'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg : Rishi, Sam, John'
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map(u => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>
                        {loading ? <div>Loading...</div> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal