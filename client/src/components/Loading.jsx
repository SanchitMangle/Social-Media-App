import React from 'react'

const Loading = ({height = '100vh'}) => {
  return (
    <div style={{height}} className='flex items-center justify-center h-screen'>
      <div className='h-16 w-16 rounded-full border-3 border-t-transparent border-purple-500 animate-spin'></div>
    </div>
  )
}

export default Loading
