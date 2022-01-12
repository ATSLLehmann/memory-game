import React, {useState, useEffect} from "react"
import {useSpring, animated as a } from "react-spring"

export default function App(){
  const [options, setOptions] = useState(null)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const json = localStorage.getItem('memorygamehighscore')
    const savedScore = JSON.parse(json)
    if (savedScore) {
      setHighScore(savedScore)
    }
  }, [])

  return(
    <div>
      <div className="container">
        <h1>Memory Game</h1>
        <div>High Score: {highScore}</div>
        <div>
          {options===null ? (
            <>
              <button onClick={()=>setOptions(12)}>Easy</button>
              <button onClick={()=>setOptions(18)}>Medium</button>
              <button onClick={()=>setOptions(24)}>Hard</button>
            </>
          ) : (
            <>
              <button
                onClick={()=>{
                  const prevOptions = options
                  setOptions(null)
                  setTimeout(()=>{
                    setOptions(prevOptions)
                  }, 5)
                }}
                >
                  Start Over
                </button>
            </>
          )}
        </div>
      </div>
      {options ? (
        <MemoryGame
          options = {options}
          setOptions = {setOptions}
          highScore = {highScore}
          setHighScore = {setHighScore}
        />
      ) : (
        <h2>Choose a difficulty to begin!</h2>
      )}
      <style jsx global>
    {`
      body {
        text-align: center;
        font-family: -apple-system, sans-serif;
      }
      .container {
        width: 90%;
        margin: 0 5%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5em;
      }
      button {
        background: #00ad9f;
        border-radius: 4px;
        font-weight: 700;
        color: #fff;
        border: none;
        padding: 7px 15px;
        margin-left: 8px;
        cursor: pointer;
      }
      button:hover {
        background: #008378;
      }
      button:focus {
        outline: 0;
      }
      #cards {
        width: 90vw;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
      }
      .card {
        width: calc(90vw/7);
        height: calc(90vw/7);
        margin-bottom: 1.5em;
        
      }
      .card:not(:nth-child(6n)) {
        margin-right: 1.5em;
      }
  
      .c {
        position: absolute;
        max-width: calc(90vw/7);
        max-height: calc(90vw/7);
        width: 50ch;
        height: 50ch;
        cursor: pointer;
        will-change: transform, opacity;

        border-radius: 0.5em;
        box-shadow: .1em .1em .5em .1em #9300ff;
      }
  
      .front,
      .back {
        background-size: cover;
      }
  
      .back {
        background-image: url(https://www.accenture.com/t20200701T040724Z__w__/us-en/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Global/Hero/12/Accenture-Logo-768x768.jpg);
      }
  
      .front {
        background-image: url(https://images.unsplash.com/photo-1540206395-68808572332f?ixlib=rb-1.2.1&w=1181&q=80&auto=format&fit=crop);
      }
    `}
  </style>
    </div>
    
  )
}

function MemoryGame({options, setOptions, highScore, setHighScore}){
  const [game, setGame] = useState([])
  const [flippedCount, setFlippedCount] = useState(0)
  const [flippedIndexes, setFlippedIndexes] = useState([])

  const images = [
    'https://www.accenture.com/t00010101T000000Z__w__/ch-de/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Local/Hero/1/Innovation-2019-Brief-ACC-Hero-768x768.jpg',
    'https://www.accenture.com/t00010101T000000Z__w__/de-de/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Global/Hero/7/Accenture-AMBG-Butterfly-Marquee-487x337.png',
    'https://www.accenture.com/t20201011T094743Z__w__/de-de/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Global/General/67/Accenture-SC-Mixed-Media-768x432-No-Border.jpg',
    'https://www.accenture.com/t00010101T000000Z__w__/de-de/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Global/Hero/16/Accenture-Greater-than-hero-760x551.png',
    'https://media-exp1.licdn.com/dms/image/C4E0BAQHPs3XRp-xGlQ/company-logo_200_200/0/1622731254429?e=2159024400&v=beta&t=mo_XIljIE2uqFf1xSXttvcc-nbUS_mO-qBJYWMucXDg',
    'https://www.accenture.com/t00010101T000000Z__w__/at-de/_acnmedia/Thought-Leadership-Assets/Images/mainpage/Accenture-acn-mobile-logo-2.png',
    'https://www.umlaut.com/uploads/images/Logos/_1024x768_crop_center-center_none/379229/umlaut-part-of-Accenture-4-3.jpg',
    'https://www.accenture.com/t00010101T000000Z__w__/de-de/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Global/General/13/Accenture-Social-SAP-Facebook.png',
    'https://www.accenture.com/t00010101T000000Z__w__/de-de/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Global/Thumbnail768x432/1/Accenture-Siemens-768x432.jpg',
    'https://www.accenture.com/t00010101T000000Z__w__/de-de/_acnmedia/Accenture/Redesign-Assets/DotCom/Images/Global/Hero/9/Accenture-AccSec-Dotcom-CoreImg-CD1-760x551.jpg',
    'https://i.ytimg.com/vi/d4GN5PITf44/maxresdefault.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSZvsnuMpziaiHsOxiwjOaern82ArZv0Drag&usqp=CAU'
  ]

  useEffect(() => {
    const newGame = []
    for (let i = 0; i<options/2; i++){
      const firstOption = {
        id: 2*i,
        colorId: i,
        color: images[i],
        flipped: false,
      }
      const secondOption = {
        id: 2*i+1,
        colorId: i,
        color: images[i],
        flipped: false,
      }

      newGame.push(firstOption)
      newGame.push(secondOption)
    }
      const shuffledGame = newGame.sort(()=>Math.random() - 0.5)
      setGame(shuffledGame)
  }, [])

  useEffect(() => {
    const finished = !game.some(card => !card.flipped)
    if (finished && game.length > 0) {
      setTimeout(() => {
        const bestPossible = game.length
        let multiplier

        if (options === 12) {
          multiplier = 5
        } else if (options === 18) {
          multiplier = 2.5
        } else if (options === 24) {
          multiplier = 1
        }

        const pointsLost = multiplier * (0.66 * flippedCount - bestPossible)

        let score
        if (pointsLost < 100) {
          score = 100 - pointsLost
        } else {
          score = 0
        }

        if (score > highScore) {
          setHighScore(score)
          const json = JSON.stringify(score)
          localStorage.setItem('memorygamehighscore', json)
        }

        const newGame = confirm('You Win!, SCORE: ' + score + ' New Game?')
        if (newGame) {
          const gameLength = game.length
          setOptions(null)
          setTimeout(() => {
            setOptions(gameLength)
          }, 5)
        } else {
          setOptions(null)
        }
      }, 500)
    }
  }, [game])

  if(flippedIndexes.length === 2){
    const match = game[flippedIndexes[0]].colorId === game[flippedIndexes[1]].colorId

    if (match) {
      const newGame = [...game]
      newGame[flippedIndexes[0]].flipped = true
      newGame[flippedIndexes[1]].flipped = true
      setGame(newGame)

      const newIndexes = [...flippedIndexes]
      newIndexes.push(false)
      setFlippedIndexes(newIndexes)
    } else {
      const newIndexes = [...flippedIndexes]
      newIndexes.push(true)
      setFlippedIndexes(newIndexes)
    }
  }

  if(game.length === 0) return <div>loading...</div>
  else{
    return(
      <div id="cards">
        {game.map((card, index) => (
          <div className="card" key={index}>
            <Card 
              id = {index}
              color = {card.color}
              game = {game}
              flippedCount = {flippedCount}
              setFlippedCount = {setFlippedCount}
              flippedIndexes = {flippedIndexes}
              setFlippedIndexes = {setFlippedIndexes}
            />
          </div>
        ))}
      </div>
    )
  }
}

function Card({id, color, game, flippedCount, setFlippedCount, flippedIndexes, setFlippedIndexes}){
  const [flipped, set] = useState(false)
  const {transform, opacity} = useSpring({
    opacity : flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: {mass: 5, tension: 500, friction: 80},
  })

  useEffect(() => {
    if (flippedIndexes[2] === true && flippedIndexes.indexOf(id) > -1) {
      setTimeout(() => {
        set(state => !state)
        setFlippedCount(flippedCount + 1)
        setFlippedIndexes([])
      }, 1000)
    } else if (flippedIndexes[2] === false && id === 0) {
      setFlippedCount(flippedCount + 1)
      setFlippedIndexes([])
    }
  }, [flippedIndexes])

  const onCardClick = () => {
    if (!game[id].flipped && flippedCount % 3 === 0) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    } else if (
      flippedCount % 3 === 1 &&
      !game[id].flipped &&
      flippedIndexes.indexOf(id) < 0
    ) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    }
  }

  return(
    <div onClick={onCardClick}>
      <a.div className="c back"
        style = {{
          opacity: opacity.to(o => 1-o),
          transform,
        }}
      />
      <a.div className="c front"
        style={{
          opacity,
          transform: transform.to(t=>`${t} rotateY(180deg)`),
          backgroundImage: `url(${color})`,
          backgorundSize: `fit`,
        }}
      />
    </div>
  )
}