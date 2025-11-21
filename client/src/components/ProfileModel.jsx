import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'

const ProfileModel = () => {
    const user = dummyUserData
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        profile_picture: null,
        location: user.location,
        full_name: user.full_name
    })
    const handleSaveProfile = async (e) => {
        e.preventDefault()
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
            <div className='max-w-2xl sm:py-6 mx-auto'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>
                    <form className='space-y-4' onSubmit={handleSaveProfile}>
                        {/* profile picture */}
                        <div className='flex flex-col itmes-start gap-3'>
                            <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
                                Profile Picture
                                <input hidden type="file" id="profile_picture" accept='image/*'
                                    className='w-full p-3 border border-gray-300 rounded-lg'
                                    onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} />
                                <div className='group/profile relative'>
                                    <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt=""
                                        className='w-24 h-24 object-cover rounded-full mt-2' />
                                    <div className='absolute hidden group-hover/profile:flex top-0 left-0 bottom-0 right-0 bg-black/20 rounded-full items-center justify-center'>
                                        <Pencil className='w- h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileModel
