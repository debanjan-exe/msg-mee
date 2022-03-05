import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import ChatBox from '../components/ChatBox'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats'
import { ChatState } from '../Context/ChatProvider'

const ChatPage = () => {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false);
    // console.log(user);
    return (
        <div style={{ width: "100%" }} >
            {user ? <SideDrawer /> : <h1>Loading</h1>}
            <Box
                d="flex"
                justifyContent="space-between"
                w="100%"
                h="91vh"
                p="7px"
            >
                {user ? <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> : <h1>Loading</h1>}
                {user ? <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> : <h1>Loading</h1>}
            </Box>
        </div >
    )
}

export default ChatPage