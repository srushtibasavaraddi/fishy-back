import React from 'react'
import { Link } from 'react-router-dom'

const HostScreen = () => {
    return (
    <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        Admin authentication
        <br></br>
        <Link to='/admin/link'>
            <button className='btn btn-primary btn-lg'>Enter</button>
        </Link>
    </div>
    )
}

export default HostScreen
