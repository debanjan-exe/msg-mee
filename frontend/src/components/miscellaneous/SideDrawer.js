import React, { useState } from 'react'
import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    InputGroup,
    InputRightElement,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, ExternalLinkIcon, InfoOutlineIcon, SearchIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { Effect } from "react-notification-badge"
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const history = useHistory();
    const { user, setUser, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/")
        setUser();
    }

    const handleSearch = async (query) => {
        if (!query) {
            setSearchResult()
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
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

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("/api/chat", { userId }, config)

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
            setSearchResult([]);
            setSearch("");

        } catch (error) {
            toast({
                title: "Error fetching the chat !",
                description: error.message,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoadingChat(false);
        }
    }

    return (
        <div>
            <Box
                d="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip
                    // label="Search Users to Chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text d={{ base: "none", md: "flex" }} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work Sans">
                    msg.me
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={0} >
                            {!notification.length && <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>No New Messages</span>}
                            {notification.map((notif) => (
                                <MenuItem _hover={{ bg: "#fff" }} bg={{ base: "#fff", md: "#fff" }} key={notif._id} onClick={() => {
                                    setSelectedChat(notif.chat)
                                    setNotification(notification.filter((n) => n !== notif))
                                }}>
                                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>
                                    {/* <i className="fa-solid fa-user" /> */}
                                    <InfoOutlineIcon mr={2} />
                                    My Profile
                                </MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>
                                <ExternalLinkIcon mr={2} />
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

                    <DrawerBody d="flex" flexDir="column" alignItems="center" >
                        <Box d="Flex" pb={2}>
                            <InputGroup>
                                <InputRightElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input
                                    placeholder="Search by Name or Email"
                                    variant='filled'
                                    bg="#fff"
                                    _focus={{ bg: "#edf2f7" }}
                                    _hover={{ bg: "#edf2f7" }}
                                    width='auto'
                                    htmlSize={24.9}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        handleSearch(e.target.value)

                                    }}
                                />
                            </InputGroup>
                            {/* <Button onClick={handleSearch}>Go</Button> */}
                        </Box>
                        {loading ? <ChatLoading /> :
                            (searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            )))
                        }
                        {loadingChat && <Spinner mt={5} size="lg" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawer