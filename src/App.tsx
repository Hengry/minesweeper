import React, { useCallback, useReducer } from 'react';
import sampleSize from 'lodash/sampleSize';

import Brick from './components/Brick';
import { Status } from './types';

interface InitMap {
  width: number;
  height: number;
  minesCount: number;
  indexEnsureNoMine: number;
}
const initMap = ({ width, height, minesCount, indexEnsureNoMine }: InitMap) => {
  const numbering = Array.from({ length: width * height - 1 }, (_, i) => i);
  const mines: number[] = sampleSize(numbering, minesCount);
  const minesMap = numbering.map(index => +mines.includes(index));
  minesMap.splice(indexEnsureNoMine, 0, 0);
  return minesMap.map((_, index) => {
    if (minesMap[index]) return -1;
    return (
      (minesMap[index + 1] || 0) +
      (minesMap[index - 1] || 0) +
      (minesMap[index + width] || 0) +
      (minesMap[index - width] || 0)
    );
  });
};

interface State {
  width: number;
  height: number;
  minesCount: number;
  contentMap: number[];
  statusMap: Array<Status>;
  gameStarted: boolean;
  gameOvered: boolean;
}

type Actions =
  | {
      type: 'click';
      payload: number;
    }
  | {
      type: 'reset';
    };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'click':
      if (state.gameStarted) {
        const newStatus = [...state.statusMap];
        newStatus[action.payload] = 'revealed';
        return {
          ...state,
          statusMap: newStatus,
        };
      }
      // initialize
      return {
        ...state,
        contentMap: initMap({
          width: state.width,
          height: state.height,
          minesCount: state.minesCount,
          indexEnsureNoMine: action.payload,
        }),
        gameStarted: true,
        statusMap: Array.from({ length: state.width * state.height }, (_, i) =>
          i === action.payload ? 'revealed' : undefined
        ),
      };
    case 'reset':
    default:
      return state;
  }
};

const initialState = {
  width: 10,
  height: 10,
  minesCount: 10,
  contentMap: Array.from({ length: 10 * 10 }, () => 0),
  statusMap: [],
  gameStarted: false,
  gameOvered: false,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleClick = useCallback(() => {}, []);
  return (
    <div className='App'>
      <div className='grid grid-cols-10'>
        {state.contentMap.map((brickContent, index) => (
          <Brick content={brickContent} status={state.statusMap[index]} />
        ))}
      </div>
    </div>
  );
};

export default App;
