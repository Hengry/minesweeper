import React, { useCallback, useMemo, useReducer } from 'react';
import sampleSize from 'lodash/sampleSize';
import chunk from 'lodash/chunk';

import Brick from './components/Brick';
import { Status } from './types';

const getAdjacentIndices = (index: number, width: number, height: number) => {
  const fullAdjacents = [
    index - width - 1,
    index - width,
    index - width + 1,
    index - 1,
    index + 1,
    index + width - 1,
    index + width,
    index + width + 1,
  ];
  if (index < width) {
    fullAdjacents[0] = -1;
    fullAdjacents[1] = -1;
    fullAdjacents[2] = -1;
  } else if (index >= width * (height - 1)) {
    fullAdjacents[5] = -1;
    fullAdjacents[6] = -1;
    fullAdjacents[7] = -1;
  }
  if (index % width === 0) {
    fullAdjacents[0] = -1;
    fullAdjacents[3] = -1;
    fullAdjacents[5] = -1;
  } else if (index % width === height - 1) {
    fullAdjacents[2] = -1;
    fullAdjacents[4] = -1;
    fullAdjacents[7] = -1;
  }
  return fullAdjacents.filter(i => i !== -1);
};

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
    return getAdjacentIndices(index, width, height).reduce(
      (sum, i) => sum + minesMap[i] || 0,
      0
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

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'click': {
      let newState: State;
      if (state.gameStarted) {
        const newStatus = [...state.statusMap];
        newStatus[action.payload] = 'revealed';
        newState = {
          ...state,
          statusMap: newStatus,
        };
      } else {
        newState = {
          ...state,
          contentMap: initMap({
            width: state.width,
            height: state.height,
            minesCount: state.minesCount,
            indexEnsureNoMine: action.payload,
          }),
          gameStarted: true,
          statusMap: Array.from(
            { length: state.width * state.height },
            (_, i) => (i === action.payload ? 'revealed' : 'default')
          ),
        };
      }
      return newState.contentMap[action.payload] === 0
        ? getAdjacentIndices(action.payload, state.width, state.height).reduce(
            (nextState, index) =>
              state.statusMap[index] === 'default'
                ? reducer(nextState, { type: 'click', payload: index })
                : nextState,
            newState
          )
        : newState;
    }
    case 'reset':
    default:
      return state;
  }
};

const initialState: State = {
  width: 10,
  height: 10,
  minesCount: 10,
  contentMap: Array.from({ length: 10 * 10 }, () => 0),
  statusMap: Array.from({ length: 10 * 10 }, () => 'default'),
  gameStarted: false,
  gameOvered: false,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleClick = useCallback((numbering: number) => {
    dispatch({ type: 'click', payload: numbering });
  }, []);
  const brickMatrix = useMemo(
    () =>
      chunk(
        state.contentMap.map((content, index) => ({ content, index })),
        state.width
      ).map((bricks, rowIndex) => ({ rowIndex, bricks })),
    [state.contentMap, state.width]
  );

  return (
    <div className='App'>
      <div>
        {brickMatrix.map(({ bricks, rowIndex }) => (
          <div key={rowIndex} className='flex'>
            {bricks.map(({ content, index }) => (
              <Brick
                key={index}
                numbering={index}
                content={content}
                status={state.statusMap[index]}
                onClick={handleClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
