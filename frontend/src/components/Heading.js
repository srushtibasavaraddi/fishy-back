import React from 'react'

const Heading = ({text, display}) => {
    return (
        <h1 className = {display}>{text}</h1>
    )
}

export default Heading
