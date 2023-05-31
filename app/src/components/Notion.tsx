import axios from 'axios'
import { Flex, Spacer, Text } from '@chakra-ui/react'
import type { Task } from '../model/task'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const Notion = ({
  displayWidth,
  tasks,
}: {
  displayWidth: string
  tasks: Task[]
}) => {
  return (
    <Flex
      h="500px"
      maxH="500px"
      overflow="auto"
      pr={4}
      w={displayWidth}
      alignItems="center"
      direction="column"
    >
      {tasks.map((data) => {
        return <NotionTaskContainer key={data.pageId} {...data} />
      })}
    </Flex>
  )
}

const NotionTaskContainer = (task: Task) => {
  const taskName: string = task.name
  const start = dayjs(task.start)
  const end = task.end !== null ? dayjs(task.end) : null

  const startStr = convertToTimeString(start)
  const endStr = convertToTimeString(end)
  const elapseTime = calcElapseTime(start, end)

  return (
    <Flex w="full">
      <Flex w="200px">
        <Text color="white">{taskName}</Text>
      </Flex>
      <Spacer />
      <Flex px={2} w="60px">
        <Text color="white" fontFamily="Roboto Mono">
          {startStr}
        </Text>
      </Flex>
      <Text color="white">~</Text>
      <Flex px={2} w="60px">
        <Text color="white" fontFamily="Roboto Mono">
          {endStr}
        </Text>
      </Flex>
      <Flex px={2} w="100px" justifyContent="right">
        <Text color="white" fontFamily="Roboto Mono">
          {elapseTime}
        </Text>
      </Flex>
    </Flex>
  )
}

const convertToTimeString = (time: dayjs.Dayjs | null): string | null => {
  if (time === null) return null
  return time.format('HH:mm')
}

const calcElapseTime = (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs | null
): string | null => {
  if (end === null) return null
  const elapseTime = dayjs.duration(end.diff(start))
  const hours = elapseTime.hours().toString().padStart(2, '0')
  const minutes = elapseTime.minutes().toString().padStart(2, '0')
  const seconds = elapseTime.seconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export const startTask = (
  task: Task,
  setTasks: (value: Task[] | ((prevValue: Task[]) => Task[])) => void
) => {
  const postTask: Task = {
    name: task.name,
    start: task.start,
    end: task.end,
    tag: task.tag,
    pageId: 'frontend-temp-pageId',
  }

  setTasks((prevTasks) => {
    return [...prevTasks, postTask]
  })

  axios
    .post('/api/task', postTask)
    .then((res) => {
      const newTask = {
        ...postTask,
        pageId: res.data.data.id,
      }
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks]
        const index = newTasks.findIndex(
          (task) => task.pageId === 'frontend-temp-pageId'
        )
        newTasks[index] = newTask
        return newTasks
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

export const stopTask = (end: string, id: string | null, start: string) => {
  if (id === null) {
    console.log('task id is null')
    return
  }

  const postTask: Task = {
    name: '',
    start: start,
    end: end,
    tag: '',
    pageId: id,
  }

  axios
    .patch('/api/task', postTask)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.error(err)
    })
}
