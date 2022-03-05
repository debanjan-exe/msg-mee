import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            d="flex"
            alignItems="center"
            justifyContent='center'
            px={3}
            py={1}
            borderRadius="xl"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            backgroundColor="purple"
            color="white"
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon pl={1} />
        </Box>
    )
}

export default UserBadgeItem