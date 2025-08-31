import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import Menuitems from '../components/Menuitems'
import { CirclePlus, LogOut } from 'lucide-react'
import { useClerk, UserButton } from '@clerk/clerk-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

    const navigate = useNavigate()
    const user = dummyUserData
    const { signOut } = useClerk()

    return (
        <div className={`w-60 xl:w-72 bg-white border border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
            <div className='w-full'>
                <img onClick={() => navigate('/')} src={assets.logo} className='w-26 ml-7 my-2 cursor-pointer' alt="" />
                <hr className='border border-gray-300 mb-8' />
                <Menuitems setSidebarOpen={sidebarOpen} />
                <Link to={'/create-post'} className='flex items-center justify-center  py-2.5 mt-6 mx-6 gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 has-only:from-indigo-700 hover:to-purple-800  text-white rounded-lg active:scale-95 transition cursor-pointer'>
                    <CirclePlus className='w-5 h-5' />
                    Create Post
                </Link>
            </div>

            <div className='w-full border-t border-gray-200 px-7 p-4 flex items-center justify-between'>
                <div className='flex gap-2  items-center cursor-pointer'>
                    <UserButton />
                    <div>
                        <h1 className='text-sm font-medium'>{user.full_name}</h1>
                        <p className='text-xs text-gray-500'>@{user.username}</p>
                    </div>
                </div>
                <LogOut onClick={signOut}
                    className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
            </div>

        </div>
    )
}

export default Sidebar
