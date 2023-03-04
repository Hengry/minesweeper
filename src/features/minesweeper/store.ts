import { create } from 'zustand';

import { Status } from './types';
import { getAdjacentIndices, initMap } from './utils';

interface MinesweeperState {
  width: number;
  height: number;
  minesCount: number;
  contentMap: number[];
  statusMap: Array<Status>;
  gameStarted: boolean;
  bombIndex?: number;
  reveal: (index: number) => void;
  revealAll: (index: number) => void;
  flag: (index: number) => void;
  reset: () => void;
}

const reveal = (state: MinesweeperState, index: number): MinesweeperState => {
  if (state.statusMap[index] !== 'default') return state;
  let newState: MinesweeperState;
  if (state.gameStarted) {
    const newStatus = [...state.statusMap];
    newStatus[index] = 'revealed';
    newState =
      state.contentMap[index] === -1
        ? {
            ...state,
            bombIndex: index,
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
        indexEnsureNoMine: index,
      }),
      gameStarted: true,
      statusMap: Array.from({ length: state.width * state.height }, (_, i) =>
        i === index ? 'revealed' : 'default'
      ),
    };
  }
  return newState.contentMap[index] === 0
    ? getAdjacentIndices(index, state.width, state.height).reduce(
        (nextState, i) => reveal(nextState, i),
        newState
      )
    : newState;
};

const width = 10;
const height = 10;
const minesCount = 15;
const useMinesweeperStore = create<MinesweeperState>()(set => ({
  width,
  height,
  minesCount,
  contentMap: Array.from({ length: width * height }, () => 0),
  statusMap: Array.from({ length: width * height }, () => 'default'),
  gameStarted: false,
  bombIndex: undefined,
  // reveal is a recursive function so it need to be declared outside
  reveal: (index: number) => set(state => reveal(state, index)),
  revealAll: (index: number) =>
    set(state => {
      if (state.statusMap[index] !== 'default') {
        const adjacentIndices = getAdjacentIndices(
          index,
          state.width,
          state.height
        );
        const flagCounts = adjacentIndices.reduce(
          (sum, i) => sum + (state.statusMap[i] === 'flagged' ? 1 : 0),
          0
        );
        if (flagCounts === state.contentMap[index]) {
          return adjacentIndices.reduce(
            (nextState, i) => reveal(nextState, i),
            state
          );
        }
      }
      return state;
    }),
  flag: (index: number) =>
    set(state => {
      if (state.gameStarted && state.statusMap[index] !== 'revealed') {
        const newStatus = [...state.statusMap];
        newStatus[index] =
          newStatus[index] === 'flagged' ? 'default' : 'flagged';
        return {
          ...state,
          statusMap: newStatus,
        };
      }
      return state;
    }),
  reset: () =>
    set(state => ({
      ...state,
      contentMap: Array.from({ length: state.width * state.height }, () => 0),
      statusMap: Array.from(
        { length: state.width * state.height },
        () => 'default'
      ),
      gameStarted: false,
      bombIndex: undefined,
    })),
}));

export default useMinesweeperStore;
