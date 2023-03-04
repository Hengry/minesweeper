import sampleSize from 'lodash/sampleSize';

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
  bombIndex?: number;
}

type Actions =
  | {
      type: 'reveal';
      payload: number;
    }
  | {
      type: 'revealAll';
      payload: number;
    }
  | {
      type: 'flag';
      payload: number;
    }
  | {
      type: 'reset';
    };

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'reveal': {
      if (state.statusMap[action.payload] !== 'default') return state;
      let newState: State;
      if (state.gameStarted) {
        const newStatus = [...state.statusMap];
        newStatus[action.payload] = 'revealed';
        newState =
          state.contentMap[action.payload] === -1
            ? {
                ...state,
                bombIndex: action.payload,
                statusMap: Array.from(
                  { length: state.width * state.height },
                  () => 'revealed'
                ),
              }
            : {
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
              reducer(nextState, { type: 'reveal', payload: index }),
            newState
          )
        : newState;
    }
    case 'revealAll':
      if (state.statusMap[action.payload] !== 'default') {
        const adjacentIndices = getAdjacentIndices(
          action.payload,
          state.width,
          state.height
        );
        const flagCounts = adjacentIndices.reduce(
          (sum, index) => sum + (state.statusMap[index] === 'flagged' ? 1 : 0),
          0
        );
        if (flagCounts === state.contentMap[action.payload]) {
          return adjacentIndices.reduce(
            (nextState, index) =>
              reducer(nextState, { type: 'reveal', payload: index }),
            state
          );
        }
      }
      return state;
    case 'flag':
      if (state.gameStarted) {
        const newStatus = [...state.statusMap];
        newStatus[action.payload] =
          newStatus[action.payload] === 'flagged' ? 'default' : 'flagged';
        return {
          ...state,
          statusMap: newStatus,
        };
      }
      return state;
    case 'reset':
      return {
        ...state,
        contentMap: Array.from({ length: state.width * state.height }, () => 0),
        statusMap: Array.from(
          { length: state.width * state.height },
          () => 'default'
        ),
        gameStarted: false,
        bombIndex: undefined,
      };
    default:
      return state;
  }
};

export const initialState: State = {
  width: 10,
  height: 10,
  minesCount: 10,
  contentMap: Array.from({ length: 10 * 10 }, () => 0),
  statusMap: Array.from({ length: 10 * 10 }, () => 'default'),
  gameStarted: false,
};
