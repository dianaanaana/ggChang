import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddRecord from './pages/AddRecord'
import Friends from './pages/Friends'
import FriendDashboard from './pages/FriendDashboard'
import AddFriends from './pages/AddFriends'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add-record" element={<AddRecord />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/friends/:friendId" element={<FriendDashboard />} />
      <Route path="/add-friend" element={<AddFriends />} />
    </Routes>
  )
}
