import React from 'react'
import './Scores.css'

const Scores = ({show, scores, players}) => {
    let total = [0,0,0,0]
    let rowScore = 0
    return (
        <ul className = "scores">
            <li className={`titles grid-display ${show}`}>
            <p className="grid-display-item">Round</p>
            {players.map((player, index) => {
            return (
              <p key={index} className="grid-display-item">
                {player.playerName}
              </p>
            );
          })}
          {show ? <p className="grid-display-item display">Round Total</p> : null}
            </li>
          {scores.map(((score, index) => {
              let row = 0
              if(index === scores.length - 1){
                  return(
                      <li key = {index} className = {`grid-display active ${show}`}>
                         <p className="grid-display-item">{`#${index + 1}`}</p>
                            {score.map((indivScore, ind) => {
                                total[ind] += indivScore
                                row += indivScore
                                rowScore += indivScore
                                return (
                                    <p key={`${index + 1}.${ind}`} className="grid-display-item">
                                      {indivScore}
                                    </p>
                                )                 
                            })}
                            {show === true ? (
                            <p className="grid-display-item display">{row}</p>
                            ) : null}
                      </li>
                  )
              }
              return (
                <li key={`${index + 1}`} className={`grid-display ${show}`}>
                <p className="grid-display-item">{`#${index + 1}`}</p>
                {score.map((indivScore, ind) => {
                  total[ind] += indivScore;
                  row += indivScore;
                  rowScore += indivScore;
                  return (
                    <p key={`${index + 1}.${ind}`} className="grid-display-item">
                      {indivScore}
                    </p>
                  );
                })}
                {show === true ? (
                  <p className="grid-display-item display">{row}</p>
                ) : null}
                </li>
              )
          }))
          }
            <li className={`grid-display total ${show}`}>
            <p className="grid-display-item">Total</p>

            {total.map((score, ind) => {
                return (
                <p key={`${ind + 1}`} className="grid-display-item">
                    {score}
                </p>
                );
            })}
            {show ? (
                <p className="grid-display-item row-total display">{rowScore}</p>
            ) : null}
            </li>
        </ul>
    )
}

export default Scores
