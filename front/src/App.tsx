import { useEffect, useRef, useState } from "react";
import { useReducerWithMiddleware } from "./hooks/useReducerWithMiddleware"
import "./App.scss";
import { Directions } from "./enum/Directions"
import {MarkerCoordinates } from "./types/MarkerCoordinates"
import { checkVictory } from "./game/checkVictory"
import SoccerMap from "./components/SoccerMap"

const STEP_VALUE = 0.0005;

const center = {
  lat: 32.0643943522365,
  lng: 34.77461837308651
};

function positionReducer(state: MarkerCoordinates, action: Directions): MarkerCoordinates {
  if (action === Directions.UP) return { ...state, lat: state.lat + STEP_VALUE };
  if (action === Directions.DOWN) return { ...state, lat: state.lat - STEP_VALUE };
  if (action === Directions.LEFT) return { ...state, lng: state.lng - STEP_VALUE };
  if (action === Directions.RIGHT) return { ...state, lng: state.lng + STEP_VALUE };
  return state;
}

function App() {
  const [goalPosition, setGoalPosition] = useState(center);
  const [userPosition, dispatchUserPosition]: [any,any] = useReducerWithMiddleware(
    positionReducer,
    center,
    ()=>checkVictory(userPosition, goalPosition)
  );

  const [buttonLeft, buttonRight, buttonUp, buttonDown] = Array.from({length: 4}).map(() => useRef(null))

  useEffect(() => {
    const fetchGoalPosition = async () => {
      try {
        const resJson = await fetch(import.meta.env.VITE_BACKEND_URL + "/goal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ lat: userPosition.lat, lng: userPosition.lng })
        });
        const position = await resJson.json();
        const [lat, lng] = position.goal.geometry.coordinates;
        setGoalPosition({ lat, lng });
      } catch (error) {
        console.error(error);
      }
    };
    fetchGoalPosition();
  }, []);

  const handleKeyDown = (e: KeyboardEvent)=> {
    if (e.key === "ArrowUp") dispatchUserPosition(Directions.UP);
    if (e.key === "ArrowDown") dispatchUserPosition(Directions.DOWN);
    if (e.key === "ArrowLeft") dispatchUserPosition(Directions.LEFT);
    if (e.key === "ArrowRight") dispatchUserPosition(Directions.RIGHT);
    const selectedButton = [buttonUp, buttonDown, buttonLeft, buttonRight].find(button => button.current.id === e.key)
    if (selectedButton) selectedButton.current.classList.add('active')
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    [buttonUp, buttonDown, buttonLeft, buttonRight].forEach(button => button.current.classList.remove('active'))
  }

  return (
    <div className="container">
      <SoccerMap userPosition={userPosition} goalPosition={goalPosition} />
      <div className="controls" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0">
        <h1>Soccer around Zorba !</h1>
        <p>Use the arrow keys to move the marker</p>
        <div className="control-grid">
          <button ref={buttonLeft} id="ArrowLeft" data-button-left onClick={() => dispatchUserPosition(Directions.LEFT)}>
            ⬅
          </button>
          <button ref={buttonUp} id="ArrowUp" data-button-up onClick={() => dispatchUserPosition(Directions.UP)}>
          ⬆
          </button>
          <button ref={buttonRight} id="ArrowRight" data-button-right onClick={() => dispatchUserPosition(Directions.RIGHT)}>
          ➡
          </button>
          <button ref={buttonDown} id="ArrowDown" data-button-down onClick={() => dispatchUserPosition(Directions.DOWN)}>
          ⬇
          </button>
        </div>
      </div>
    </div>
  );
}



export default App;

