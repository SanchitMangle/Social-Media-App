import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Conections from './pages/Conections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import { useUser } from '@clerk/clerk-react'

const App = () => {

  const {user} = useUser()

  return (
    <>
      <Routes>
        <Route path='/' element={ user ? <Layout/> : <Login />}>
          <Route index  element={<Feed />} />
          <Route path='messages' element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path='connections' element={<Conections />} />
          <Route path='discover' element={<Discover />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
