import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Footer from './components/Footer';
import Tasks from "./components/Tasks";
import AddTask from './components/AddTask';
import About from './components/About';

const App = () => {
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
      const getTasks = async () => {
        const tasksFromServer = await fetchTasks()
        setTasks(tasksFromServer)
      }

      getTasks()
    }, [])

  // Fetch Tasks Data from Json Server
  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/tasks')
    const data = await response.json()

    return data
  }

   // Fetch Task Data from Json Server
   const fetchTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await response.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {
    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()

    setTasks([...tasks, data])
  }
  
  // const addTask = (task) => {
  //   const id = Math.floor(Math.random() * 10000) + 1
  //   const newTask = { id, ...task }
  //   setTasks([ ...tasks, newTask ])
  // }

  // Delete Task
  const deleteTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    response.status === 200
    ? setTasks(tasks.filter((task) => task.id !== id))
    : alert('Erroe Deleting This Task')
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })

    const data = await response.json()

    setTasks(tasks.map((task) => task.id === id 
    ? {...task, reminder: data.reminder } : task
      )
    )
  }

    return (
      <Router>
        <div className="container">
          <Header 
            onAdd={() => setShowAddTask(!showAddTask)} 
            showAdd={showAddTask} 
          />
          <Routes>
            <Route path='/' element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                <Tasks tasks={tasks} 
                onDelete={deleteTask} onToggle={toggleReminder} 
                />
                ) : (
                  'No Tasks To Show'
                )}
              </>
            } 
            />
              <Route path='/about' element={<About />} />
          </Routes>  
          <Footer /> 
        </div>
      </Router>
    );
};

export default App;
