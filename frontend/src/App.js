import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from 'react-router-dom'
import { SocketContext, socket } from './context/SocketContext';
import Home from './screens/Home/Home';
import Carousel from './screens/Rules/Rules';
import GenerateLink from './screens/Host/Link/GenerateLink';
import Lobby from './screens/Lobby/Lobby';
import Intro from './screens/Intro/Intro';
import Game from './screens/Game/Game';
import RevealScores from './screens/Host/RevealScores/RevealScores';
import SeeResults from './screens/Player/SeeResults/SeeResults';
import Scoreboard from './screens/Host/Scoreboard/Scoreboard';
import PlayerScoreboard from './screens/Player/Scoreboard/Scoreboard';
import Endgame from './screens/Endgame/Endgame';
import Waiting from './screens/Waiting/Waiting';


function App() {
  return (
    <SocketContext.Provider value = {socket}>
      <BrowserRouter>
      <Router>
        <Switch>
          <Route path = '/' exact component = {Home} />
          <Route path= '/game' exact component = {Intro} />
          <Route path= '/admin/link' exact component = {GenerateLink} />
          <Route path= '/Rules' exact component = {Carousel} />
          <Route path= '/lobby/:id' component = {Lobby} />
          <Route path = '/waiting' component = {Waiting} />
          <Route path = '/round/:id' component = {Game} />
          <Route path = '/host/results/:id' component = {RevealScores} />
          <Route path = '/player/results/:id' component = {SeeResults} />
          <Route path = '/host/scores' component = {Scoreboard} />
          <Route path = '/player/scores' component = {PlayerScoreboard} />
          <Route path = '/gameover' component = {Endgame} />
        </Switch>
      </Router>
      </BrowserRouter>
    </SocketContext.Provider>
  )
}

export default App;
