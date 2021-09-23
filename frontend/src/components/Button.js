import React from 'react'

const Button = ({clickHandler, text, display}) => {
    if(clickHandler){
    return (
            <button onClick = {(e) => clickHandler(e)} className={`btn ${display} btn-lg inline-block bg-center`}>
                {text}
            </button>
    )
    }
    return (
        <button  className={`btn ${display} btn-lg inline-block bg-center`}>
            {text}
        </button>
    )
}

export default Button
