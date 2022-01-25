import React, {useEffect} from 'react'
import { useHistory } from "react-router";
import './Home.css'
import logo from '../../images/logo.png'
const Home = () => {
const history = useHistory();
    useEffect(() => {
        setTimeout(() => {
            // window.location.href = '/game'
            history.push("/game");
        }, 4000);
    })
    
    return (
        <div>
            <div className="intro-screen flex flex-col items-center xs-mobile:ml-10">
                <img
            src={logo}
            alt="intro"
            className="opacity-100 fade-animation"
                />
            </div>
        </div>
    )
}

export default Home
