import React from 'react'
import HomeNavbar from '../../components/HomeNavBar/HomeNavbar';
import Flashcard from '../../components/Flashcard/Flashcard'
const Intro = () => {
    
    return (
        <div className = "flex items-center justify-center mt-5">
            <div className = "m-auto">
                <Flashcard text = {`Fishy Equilibrium`} />
                <HomeNavbar 
                />
            </div>
        </div>
    )
}

export default Intro
