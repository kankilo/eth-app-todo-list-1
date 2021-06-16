import React, { useCallback } from 'react'

const TodoList = ({
  tasks,
  taskCount,
  content,
  setContent,
  createTask,
  toggleTask,
}) => {
  const renderTaskCount = useCallback(() => {
    return <div>Tasks: {taskCount}</div>
  }, [taskCount])

  const addNewTaskComponent = () => {
    const onNewTaskChange = (e) => {
      setContent(e.target.value)
    }
    return (
      <>
        <input
          value={content}
          onChange={onNewTaskChange}
          placeholder='Type your new task'
        />
        <button onClick={createTask} disabled={content === ''}>
          submit
        </button>
      </>
    )
  }

  const renderTasks = useCallback(() => {
    return tasks.map((task) => {
      const style = { textDecoration: task.completed && 'line-through' }
      return (
        <div style={style} key={task.id}>
          <input
            type='checkbox'
            name={task.id}
            value={task.content}
            defaultChecked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <label htmlFor={task.id}>{task.content}</label>
        </div>
      )
    })
  }, [tasks])

  return (
    <>
      {renderTaskCount()}
      {addNewTaskComponent()}
      {renderTasks()}
    </>
  )
}

export default TodoList
