import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ptsHome, setPtsHome] = useState(0);
  const [ptsAway, setPtsAway] = useState(0);
  const [quarter, setQuarter] = useState(1);
  const [time, setTime] = useState(900);
  const [isTicking, setIsTicking] = useState(false);
  const [possession, setPossession] = useState("Home");
  const [isPAT, setIsPAT] = useState(false);
  const [timeoutsHome, setTimeoutsHome] = useState(3);
  const [noMoreTimeoutsHome, setNoMoreTimeoutsHome] = useState(false);
  const [timeoutsAway, setTimeoutsAway] = useState(3);
  const [noMoreTimeoutsAway, setNoMoreTimeoutsAway] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameMsg, setGameMsg] = useState("It's a beautiful night with clear skies.");

  useEffect(() => {
    setGameMsg("Timeout, Home");
    if(timeoutsHome === 0){
      setNoMoreTimeoutsHome(true);
    }
  }, [timeoutsHome]);

  useEffect(() => {
    setGameMsg("Timeout, Away");
    if(timeoutsAway === 0){
      setNoMoreTimeoutsAway(true);
    }
  }, [timeoutsAway]);

  useEffect(() => {
    if(time === 0){
      setQuarter(quarter+1);
      setIsTicking(false);
    }
  }, [time, quarter]);

  useEffect(() => {
    if(quarter === 3){
      setTimeoutsHome(3);
      setTimeoutsAway(3);
    }
    if(quarter === 4){
      setGameOver(true);
    }
  }, [quarter])

  useEffect(() => {
    if(gameOver === true){
      setGameMsg("Game Over");
    }
  }, [gameOver]);

  useEffect(() => {
    let interval = null;
    if(isTicking){
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTicking]);

  const timeToTimestamp = (time) => {
    const minutes = Math.floor(time/60);
    let seconds = Math.floor(time%60);
    seconds = seconds.toString().length === 1 ? seconds.toString().padStart(2, 0) : seconds.toString();
    return `${minutes}:${seconds}`;
  }

  const startClock = () => {
    setIsTicking(true);
  }

  const stopClock = () => {
    setIsTicking(false);
  }

  const newGame = () => {
    setGameMsg("It's a beautiful night with clear skies.")
    setQuarter(1);
    setIsTicking(false);
    setTime(900);
    setIsPAT(false);
    setPtsHome(0);
    setPtsAway(0);
  }

  const touchdownHome = () => {
    setPtsHome(ptsHome+6);
    setIsTicking(false);
    setIsPAT(true);
  }

  const touchdownAway = () => {
    setPtsAway(ptsAway+6);
    setIsTicking(false);
    setIsPAT(true);
  }

  const handleFieldGoal = () => {
    if(possession === "Home"){
      setPtsHome(ptsHome+3);
    } else {
      setPtsAway(ptsAway+3);
    }
    setIsTicking(false);
  }

  const handle2PtSafety = () => {
    if(possession === "Home"){
      setPtsAway(ptsAway+2);
      setPossession("Away");
    } else {
      setPtsHome(ptsHome+2);
      setPossession("Home");
    }
    setIsTicking(false);
  }

  const handle1PtSafety = () => {
    let alertMsg = window.confirm("This is an incredibly rare calling. Are you sure that the end of this play resulted in a 1 point safety?");
    if(!alertMsg){
      return;
    }

    if(possession === "Home"){
      setPtsAway(ptsAway+1);
      setPossession("Away");
    } else {
      setPtsHome(ptsHome+1);
      setPossession("Home");
    }
    setIsPAT(false);
  }

  const handlePATMissed = () => {
    setIsPAT(false);
    if(possession === "Home"){
      setPossession("Away");
    } else {
      setPossession("Home");
    }
  }

  const handlePATGood = () => {
    if(possession === "Home"){
      setPtsAway(ptsHome+1);
      setPossession("Away");
    } else {
      setPtsHome(ptsAway+1);
      setPossession("Home");
    }
    setIsPAT(false);
  }

  const handle2PtConversion = () => {
    if(possession === "Home"){
      setPtsAway(ptsHome+2);
      setPossession("Away");
    } else {
      setPtsHome(ptsAway+2);
      setPossession("Home");
    }
    setIsPAT(false);
  }

  const handle2PtDefense = () => {
    if(possession === "Home"){
      setPtsAway(ptsAway+2);
      setPossession("Away");
    } else {
      setPtsHome(ptsHome+2);
      setPossession("Home");
    }
    setIsPAT(false);
  }

  const possessionChange = () => {
    if(possession === "Home"){
      setPossession("Away");
      setGameMsg("Away has the ball");
    } else {
      setPossession("Home");
      setGameMsg("Home has the ball");
    }
  }

  const handleTimeoutHome = () => {
    setTimeoutsHome(timeoutsHome-1);
  }

  const handleTimeoutAway = () => {
    setTimeoutsAway(timeoutsAway-1);
  }

  return (
    <div className="App">
      <button onClick={newGame}>New Game</button>
      <button onClick={startClock} disabled={isPAT}>Start Clock</button>
      <button onClick={stopClock} disabled={isPAT}>Stop Clock</button>
      <button onClick={possessionChange} disabled={isPAT}>Poss Change</button>
      <button onClick={handle2PtConversion} disabled={!isPAT}>2 Pt Good</button>
      <button onClick={handle2PtDefense} disabled={!isPAT}>2 Pt Def</button>
      <button onClick={handleTimeoutHome} disabled={noMoreTimeoutsHome}>Timeout Home</button>
      <br />
      <button onClick={handlePATMissed} disabled={!isPAT}>PAT Miss</button>
      <button onClick={handlePATGood} disabled={!isPAT}>PAT Good</button>
      <button onClick={touchdownHome} disabled={isPAT}>TD Home</button>
      <button onClick={touchdownAway} disabled={isPAT}>TD Away</button>
      <button onClick={handleFieldGoal} disabled={isPAT}>Field Goal</button>
      <button onClick={handle2PtSafety} disabled={isPAT}>2 Pt Safety</button>
      <button onClick={handle1PtSafety} disabled={!isPAT}>1 Pt Safety</button>
      <button onClick={handleTimeoutAway} disabled={noMoreTimeoutsAway}>Timeout Away</button>
      <br />
      <button>-1 Home</button>
      <button>-1 Away</button>
      <button>+1 Min</button>
      <button>+1 Sec</button>
      <button>-1 Min</button>
      <button>-1 Sec</button>
      <hr />
      Quarter: {quarter}
      <h2>{timeToTimestamp(time)}</h2>
      <h3>{gameMsg}</h3>
      <h3>Home {ptsHome} - {ptsAway} Away</h3>
      <h4>Timeouts Home: {timeoutsHome}</h4>
      <h4>Timeouts Away: {timeoutsAway}</h4>
    </div>
  );
}

export default App;
