import React from 'react'

const NavComponent = (props) => {
    return (    
        <ul className = "nav nav-tabs mt-5">
            {props.children}
        </ul>
    )
}

export default NavComponent
