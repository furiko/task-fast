import { Flex, IconButton, Text } from '@chakra-ui/react'
import { VscDebugStart } from 'react-icons/vsc'

export const Task = ({ task }: { task: string }) => {
  const fontSize = '8px'
  return (
    <Flex
      h={8}
      bg="brand.taskBackground"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <IconButton aria-label="start-task-icon" icon={<VscDebugStart />} />
        <Text fontSize="12px">{task}</Text>
      </Flex>
      <Flex direction="column" pr={2}>
        <Text fontSize={fontSize}>00:20</Text>
        <Text fontSize={fontSize}>12:00</Text>
      </Flex>
    </Flex>
  )
}