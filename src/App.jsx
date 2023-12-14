import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timerType, setTimerType] = useState("Session");
  const [secondsRemaining, setSecondsRemaining] = useState(sessionTime * 60);
  const [timerState, setTimerState] = useState("pause");
  let breakSeconds = breakTime * 60;
  let sessionSeconds = sessionTime * 60;
  let minutes = Math.floor(secondsRemaining / 60);
  let seconds = secondsRemaining % 60;

  function playPause() {
    timerState === "play" ? setTimerState("pause") : setTimerState("play");
  }

  function modifyBreakTime(value) {
    if (timerState === "play") return;
    if (!((breakTime === 1 && value < 0) || (breakTime === 60 && value > 0))) {
      setBreakTime((prev) => {
        const newBreakTime = prev + value;
        setSecondsRemaining(sessionTime * 60);
        return newBreakTime;
      });
    }
  }

  function modifySessionTime(value) {
    if (timerState === "play") return;
    if (
      !((sessionTime === 1 && value < 0) || (sessionTime === 60 && value > 0))
    ) {
      setSessionTime((prev) => {
        const newSessionTime = prev + value;
        setSecondsRemaining(newSessionTime * 60);
        return newSessionTime;
      });
    }
  }

  useEffect(() => {
    let intervalId;
  
    if (timerState === "play" && secondsRemaining >= 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prevCount) => {
          if (prevCount === 0) {
            document.getElementById("beep").play();
            if (timerType === "Session") {
              setTimerType("Break");
              return breakSeconds;
            } else {
              setTimerType("Session");
              return sessionSeconds;
            }
          } else {
            return prevCount - 1;
          }
        });
      }, 1000);
    }
  
    return () => {
      clearInterval(intervalId);
    };
  }, [timerState, secondsRemaining, timerType, sessionSeconds, breakSeconds]);
  
  function reset() {
    setTimerState("pause");
    setSessionTime(() => {
      setSecondsRemaining(25 * 60)
      return 25
    });
    setBreakTime(5);
    setTimerType("Session")
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }

  return (
    <>
      <h1>Pomodoro Timer</h1>
      <div className="row">
        <div className="column">
          <h2 id="break-label">Break Length</h2>
          <div className="row narrow">
            <button id="break-decrement" onClick={() => modifyBreakTime(-1)}>
              -
            </button>
            <h2 id="break-length">{breakTime}</h2>
            <button id="break-increment" onClick={() => modifyBreakTime(+1)}>
              +
            </button>
          </div>
        </div>
        <div className="column">
          <h2 id="session-label">Session Length</h2>
          <div className="row">
            <button
              id="session-decrement"
              onClick={() => modifySessionTime(-1)}
            >
              -
            </button>
            <h2 id="session-length">{sessionTime}</h2>
            <button
              id="session-increment"
              onClick={() => modifySessionTime(+1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="column">
        <h1 id="timer-label">{timerType}</h1>
        <h1 id="time-left">
          {`
        ${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}
        `}
        </h1>
        <div className="row narrow">
          <button id="start_stop" onClick={() => playPause()}>
            {">||"}
          </button>
          <button id="reset" onClick={() => reset()}>
            @
          </button>
        </div>
      </div>
      <audio id="beep" preload="auto" autoPlay={true}>
        <source
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          type="audio/mpeg"
        ></source>
      </audio>
    </>
  );
}

export default App;
