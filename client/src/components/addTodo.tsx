import React from 'react'
import {useState} from "react"
import {useForm} from '@mantine/form'
import {Modal, Group, Button, TextInput, Textarea} from '@mantine/core'
import { ENDPOINT, Todo } from '../App'
import { KeyedMutator } from 'swr'

function AddTodo({mutate}: {mutate: KeyedMutator<Todo[]>}, {data}: {data: Todo[]}){
    const [open, setOpen] = useState(false)

    const form = useForm({
        initialValues:{
            title: '',
            body: ''
        }
    })
    async function createTodo(values: {title:string, body:string}){
        const update = await fetch(`${ENDPOINT}/api/todos`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        }).then((r)=> r.json())

        mutate(data, update)
        form.reset()
        setOpen(false)
    }

    return (
    <>
        <Modal opened={open} onClose={() => setOpen(false)} title="Create todo">
            <form onSubmit={form.onSubmit(createTodo)}>
                <TextInput
                required
                mb={12}
                label='Todo'
                placeholder='What do you want to do?'
                {...form.getInputProps("title")}
                />
                <Textarea
                    required
                    mb={12}
                    label='Body'
                    placeholder='Tell me more...'
                    {...form.getInputProps("body")}
                />
                <Button type='submit'>Create Todo</Button>
            </form>
        </Modal>
        <Group position='center'>
            <Button fullWidth mb={12} onClick={()=> setOpen(true)}>
                Add todo
            </Button>
        </Group>
    </>
    )

}
export default AddTodo