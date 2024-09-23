import React, { useState } from "react";



function getInitialState() {
    const state = { };
    for(let l= 0; l < 3; l++) {
        for(let c = 0; c < 3; c++) {
          state[`${l}-${c}`] = null;
        }
    }
    console.log(state)
    return state;
}



const getKeyFromIndex = (index) => {
    const line = Math.floor(index / 3);
    const col = index % 3;
   return `${line}-${col}`;
}

const getLabel = (value)  => {
    if (!value) {
        return null;
    }

    return value > 0 ? '0' : 'X';
}

function getWinner(v) {
    for(let l= 0; l < 3; l++) {
        for(let c = 0; c < 3; c++) {
          const sumLine = v[`${l}-${c}`] + v[`${l}-${c+1}`] + v[`${l}-${c+2}`]
          if (sumLine === 3 || sumLine === -3) {
              return sumLine;
          }

          const sumCol = 
          v[`${l}-${c}`] + 
          v[`${l + 1}-${c}`] + 
          v[`${l + 2}-${c}`]
          if (sumCol === 3 || sumCol === -3) {
              return sumCol;
          }

          const sumDia = 
          v[`${l}-${c}`] + 
          v[`${l + 1 }-${c + 1}`] + 
          v[`${l + 2}-${c + 2}`]
          if (sumDia === 3 || sumDia === -3) {
              return sumDia;
          }

          const sumDia2 = 
          v[`${l}-${c}`] +
        v[`${l + 1}-${c - 1}`] +
        v[`${l + 2}-${c - 2}`];
          if (sumDia2 === 3 || sumDia2 === -3) {
              return sumDia2;
          }

        }
    }
      
    return null;

}


const Game = ( ) => {
    const [values, setValues] = useState(getInitialState);
    const [player, setPlayer] = useState(1);
    const [starter, setStarter] = useState(1);
    const [winner, setWinner] = useState(null);
    const [scoreX, setScoreX] = useState(0);
    const [scoreO, setScoreO] = useState(0);

    //   I.A Development

    function makeAIMove(newValues) {
        // Filtra os espaços disponíveis (null)
        const availableMoves = Object.keys(newValues).filter((key) => newValues[key] === null);

        if (availableMoves.length === 0) return; // Não há mais movimentos disponíveis

        // Escolhe um movimento aleatório
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const key = availableMoves[randomIndex];

        // Atualiza o tabuleiro com a jogada da IA
        const updatedValues = {
            ...newValues,
            [key]: -1, // "X" é representado por -1
        };

        setValues(updatedValues);

        const newWinner = getWinner(updatedValues);
        if (newWinner) {
            setWinner(newWinner > 0 ? 1 : -1);
            if (newWinner > 0) {
                setScoreO(scoreO + 1);
            } else {
                setScoreX(scoreX + 1);
            }
        } else {
            setPlayer(1); // Passa a vez para o jogador "O"
        }
    }

    function handleClick(key) {
        if (winner || values[key] !== null || player === -1) {
          return;
        }

        // player1

        const newValues = {
          ...values,
          [key]: player,
        };

        setValues(newValues);
            
        const newWinner = getWinner(newValues);
        
        if (newWinner) {
            setWinner(newWinner > 0 ? 1 : -1);
            if (newWinner > 0) {
              setScoreO(scoreO + 1); 
         } else {
              setScoreX(scoreX + 1); 
                   }
          } else {

            setPlayer(-1); // Passa a vez para a IA
            // Dá um pequeno tempo para a IA "pensar"
            setTimeout(() => {
                makeAIMove(newValues);
            }, 500); // A IA faz o movimento após 500ms

          }
          console.log(player);
      }


function reset() {

setWinner(null);

// Alterna o starter para o próximo jogo
const nextStarter = starter * -1;
setStarter(nextStarter);

// Define o jogador inicial de acordo com o novo starter
const initialValues = getInitialState();
setValues(initialValues);
setPlayer(nextStarter);


// Se a IA for a próxima a começar, faz a jogada automaticamente
if (nextStarter === -1) {
        setTimeout(() => {
        makeAIMove(initialValues);
        }, 500); // IA pensa um pouco
        }



};



const itsAtie = Object
       .values(values)
       .filter(Boolean)
       .length === 9 && !winner;


       


 
    return (
        <div className="Game">

         <div className="Scoreboard">
          <input className="playerName"  value="O" disabled />
          <textarea className="playerScore" value={scoreO} readOnly />
          <textarea className="playerScore" value={scoreX} readOnly />
          <input className="playerName" value="X" disabled />
         </div> 

         
        <div className="Game__board">
            {Array.from({ length: 9}).map( (_, index) => 
                { 
                    const key = getKeyFromIndex(index);
                   return (
                 
                 <button key={index} 
                 type="button" 
                 onClick={ () => 
                 handleClick(key)}>          
                 {getLabel( values [key])}      
                    </button>

                 )
            } ) } 
           
          
        </div>
        {(winner || itsAtie) && (
            <div className="Game__menu">
          
                { winner ? (
           <p>O ganhador é: { winner > 0 ? '0' : 'X' }</p>

                ): ( 
            <p>Empate!!!</p>
                )}
            <button onClick={reset}>Reiniciar</button>
         </div>

        )}
        
    </div>
    
  )}
;

export default Game;