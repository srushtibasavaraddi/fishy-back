import React from 'react'
import './Icons.css'
const Icons = ({icon, title, clickHandler}) => {
    return (
        <button className = "icon-btn border-none" onClick = {clickHandler}>
            <img src = {icon} title = {title} alt = {title} />
        </button>
    )
}

export default Icons
