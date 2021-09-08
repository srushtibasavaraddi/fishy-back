import React from 'react'
import { Link } from 'react-router-dom'

const HostScreen = () => {
    return (
    <div className='w-full flex flex-col bg-card bg-no-repeat bg-cover bg-blend-screen shadow-lg rounded-lg px-8 pt-6 pb-8  h-full text-yellow-500 justify-center items-center'>
        Admin authentication
        <Link to='/admin/link'>
            <button className='bg-btn-bg-primary border-2 border-yellow-500 text-yellow-500 btn-lg mt-5'>Enter</button>
        </Link>
    </div>
    )
}

export default HostScreen
