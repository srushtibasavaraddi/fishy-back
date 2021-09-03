import React from 'react'

const Button = ({clickHandler, text, display}) => {
    if(clickHandler){
        
    return (
            <button onClick = {(e) => clickHandler(e)} className = {display}>
                {text}
            </button>
    )
    }
    return (
        <button  className = {display}>
            {text}
        </button>
    )
}

export default Button
