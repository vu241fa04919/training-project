import { useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import './App.css'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

function App() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Drink 8 glasses of water', completedDays: 3, isCompletedToday: false },
    { id: 2, name: 'Read for 15 minutes', completedDays: 5, isCompletedToday: true },
  ])
  const [newHabit, setNewHabit] = useState('')

  // Add a new habit
  const addHabit = (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return

    const habitToAdd = {
      id: Date.now(),
      name: newHabit,
      completedDays: 0,
      isCompletedToday: false,
    }

    setHabits([...habits, habitToAdd])
    setNewHabit('')
  }

  // Toggle habit completion for today
  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const isDone = !habit.isCompletedToday
          return {
            ...habit,
            isCompletedToday: isDone,
            completedDays: isDone ? habit.completedDays + 1 : habit.completedDays - 1,
          }
        }
        return habit
      })
    )
  }

  // Delete a habit
  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  // Calculate stats for the chart
  const completedCount = habits.filter((h) => h.isCompletedToday).length
  const totalCount = habits.length
  const remainingCount = totalCount - completedCount

  // Chart Data Configuration
  const chartData = {
    labels: ['Completed Today', 'Remaining'],
    datasets: [
      {
        data: totalCount === 0 ? [0, 1] : [completedCount, remainingCount],
        backgroundColor: ['#10b981', '#334155'],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="container">
      <h1>Daily Habit Tracker</h1>

      {/* Progress Chart Section */}
      {habits.length > 0 && (
        <div className="chart-container">
          <div className="chart-wrapper">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="stats-text">
            <h3>Today's Progress</h3>
            <p>{completedCount} of {totalCount} habits completed</p>
          </div>
        </div>
      )}

      {/* Form to add a new habit */}
      <form onSubmit={addHabit} className="habit-form">
        <input
          type="text"
          placeholder="Enter a new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button type="submit">Add Habit</button>
      </form>

      {/* List of habits */}
      <div className="habit-list">
        {habits.length === 0 ? (
          <p className="empty">No habits added yet. Start by adding one above!</p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className={`habit-card ${habit.isCompletedToday ? 'completed' : ''}`}
            >
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p>Streak: {habit.completedDays} days</p>
              </div>
              <div className="habit-actions">
                <button
                  className="check-btn"
                  onClick={() => toggleHabit(habit.id)}
                >
                  {habit.isCompletedToday ? 'Done ✓' : 'Mark Done'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteHabit(habit.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App