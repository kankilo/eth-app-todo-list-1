import React, { useEffect, useState, useCallback } from 'react'
import Web3 from 'web3'
import TodoList from './TodoList'
import { TODO_LIST_ADDRESS, TODO_LIST_ABI } from './config'

const App = () => {
  const [account, setAccount] = useState('')
  const [accountActive, setAccountActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [taskCount, setTaskCount] = useState(0)
  const [todoList, setTodoList] = useState(null)
  const web3 = new Web3(Web3.givenProvider)
  const [content, setContent] = useState('')
  const createTask = () => {
    setTasks([])
    setLoading(true)
    todoList.methods
      .createTask(content)
      .send({ from: account })
      .once('receipt', async () => {
        const count = await getTaskCount()
        updateTask(count)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (account !== '') {
      setAccountActive(true)
    } else {
      setAccountActive(false)
    }
  }, [account])

  const connectAccount = async () => {
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    getTodoList()
  }

  const getTodoList = async () => {
    const list = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    setTodoList(list)
    getTask(list)
  }

  const updateTask = async (count = taskCount) => {
    const task = await todoList.methods.tasks(count).call()
    tasks.push(task)
    setTasks(tasks)
  }

  const getTaskCount = async (list = todoList) => {
    const count = await list.methods.taskCount().call()
    setTaskCount(parseInt(count))
    return count
  }

  const getTask = async (list = todoList) => {
    const count = await getTaskCount(list)
    const tempTask = []
    for (let i = 1; i <= count; i++) {
      const task = await list.methods.tasks(i).call()
      tempTask.push(task)
      setTasks(tempTask)
    }
    setLoading(false)
  }

  useEffect(() => {
    console.log('+++')
    connectAccount()
  }, [])

  const renderConnectButton = useCallback(() => {
    const disconnectAccount = () => {
      setAccount('')
      setTasks([])
    }

    let button = <button onClick={connectAccount}>connect to metamask</button>
    if (accountActive) {
      button = (
        <div>
          Your account: {account}
          <button onClick={disconnectAccount}>Disconnect</button>
        </div>
      )
    }
    return button
  }, [accountActive, account])

  const toggleTask = (id) => {
    console.log(`id`, id)
    setTasks([])
    setLoading(true)
    todoList.methods
      .toggleCompleted(parseInt(id))
      .send({ from: account })
      .once('receipt', () => {
        getTask()
      })
  }
console.log(`tasks`, tasks)
  const _renderMain = () => (
    <>
      {renderConnectButton()}
      {accountActive && (
        <TodoList
          tasks={tasks}
          taskCount={taskCount}
          content={content}
          setContent={setContent}
          createTask={createTask}
          toggleTask={toggleTask}
        />
      )}
    </>
  )

  return loading ? <>Loading...</> : _renderMain()
}

export default App
