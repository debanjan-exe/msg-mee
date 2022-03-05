import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import Lottie from "react-lottie"
import animationData from "../assets/animations/typing.json"


const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
}

const ScrollableChat = ({ messages, isTyping }) => {
    const { user } = ChatState()
    return (
        <ScrollableFeed forceScroll="true">
            {messages && messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id}>
                    {
                        (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )
                    }
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3f8" : "#B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                        }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
            {isTyping ? <div>
                <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 0, marginLeft: 0 }}
                />
            </div> : <></>}
        </ScrollableFeed>
    )
}

export default ScrollableChat