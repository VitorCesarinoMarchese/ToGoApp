import { Box, List, ThemeIcon} from '@mantine/core'
import {CheckCircleFillIcon} from '@primer/octicons-react'
import useSWR from "swr"
import AddTodo from './components/addTodo'
import './App.css'

export const ENDPOINT = "http://localhost:8000"

export interface Todo {
  id: number,
  title: string,
  body: string,
  done: boolean
}

const fetcher = (url: string) => fetch(`${ENDPOINT}/${url}`).then((r) => r.json())

function App() {

  async function MarkAsDone(id:number){
    const update = await fetch(`${ENDPOINT}/api/todos/${id}/done`,{
      method: 'PATCH'
    }).then((r)=> r.json())

    mutate(update)
  }

  const {data, mutate} = useSWR<Todo[]>('api/todos', fetcher)

  return (
    <>
      <Box
      sx={(theme)=>({
        padding: '2rem',
        width: '100%',
        maxWidth: '40rem',
        margin: '0 auto'
      })}
      >
        <List spacing='xs' size='sm' mb={12} center>
        {data?.map((todo)=> {
          return(
            <List.Item 
            onClick={()=> MarkAsDone(todo.id)}
            key={`todo__${todo.id}`} 
            icon={
              todo.done ? (
                <ThemeIcon color="teal" size={24} radius="xl">
                  <CheckCircleFillIcon size={20} />
                </ThemeIcon>
              ) : (
                <ThemeIcon color="gray" size={24} radius="xl">
                  <CheckCircleFillIcon size={20} />
                </ThemeIcon>
              )
            }>
              {todo.title}
            </List.Item>
          )
        })}
        </List>
        <AddTodo mutate={mutate}/>
      </Box>
    </>
  )
}

export default App
