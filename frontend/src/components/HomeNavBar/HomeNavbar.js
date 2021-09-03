import React from 'react'
import NavComponent from '../NavComponent'
import './HomeNavbar.css'

const HomeNavbar = ({showPlayer, showHost}) => {
    return (
        <NavComponent>
            <li className = "nav-item ml-auto mr-auto py-1 px-6 active">
                <button className = "nav-link text-xl text-dark py-2 px-6" data-bs-toggle="tab" onClick = {showPlayer} >Join</button>
            </li>
            <li className = "nav-item ml-auto mr-auto py-1 px-6 active">
                <button className = "nav-link text-xl text-dark py-2 px-6" data-bs-toggle="tab" onClick = {showHost} >Host</button>
            </li>
        </NavComponent>
    )
}

export default HomeNavbar
