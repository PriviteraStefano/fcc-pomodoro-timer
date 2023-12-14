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


  const modifyBreakTime = (amount) => {
    if (breakTime + amount > 0 && breakTime + amount <= 60) {
      setBreakTime(breakTime + amount);
    }
  };

  const modifySessionTime = (amount) => {
    if (sessionTime + amount > 0 && sessionTime + amount <= 60) {
      setSessionTime(sessionTime + amount);
      setSecondsRemaining((sessionTime + amount) * 60);
    }
  };

  const reset = () => {
    setTimerType(() => {
      setTimerState("pause");
      setBreakTime(5);
      setSessionTime(25);
      setSecondsRemaining(25 * 60);
      document.getElementById('beep').pause();
      document.getElementById('beep').load();
      return "Session";
    })
    
  };

  const playPause = () => {
    setTimerState((prevState) => (prevState === "pause" ? "play" : "pause"));
  };

  useEffect(() => {
    let intervalId;
    if (timerState === "play" && secondsRemaining > -1) {
      intervalId = setInterval(() => {
        setSecondsRemaining(secondsRemaining - 1);
      }, 1000);
    } else if (secondsRemaining === -1) {
      setTimerType((prevType) =>
        prevType === "Session" ? "Break" : "Session"
      );
      setSecondsRemaining(
        timerType === "Session" ? breakSeconds : sessionSeconds
      );
      document.getElementById('beep').play();
    }
    return () => clearInterval(intervalId);
  }, [timerState, secondsRemaining, timerType, breakSeconds, sessionSeconds]);

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
