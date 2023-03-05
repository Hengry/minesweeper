import { create } from 'zustand';

import { Status } from './types';
import { getAdjacentIndices, initMap } from './utils';

const sumUpStatus = (array: Array<Status>, target: Status) =>
  array.reduce((sum, status) => sum + (status === target ? 1 : 0), 0);

interface MinesweeperState {
  width: number;
  height: number;
  minesCount: number;
  contentMap: number[];
  statusMap: Array<Status>;
  gameStatus: 'initial' | 'playing' | 'fail' | 'pass';
  totalFlags: number;
  bombIndex?: number;
  reveal: (index: number) => void;
  revealAll: (index: number) => void;
  flag: (index: number) => void;
  reset: () => void;
}

const reveal = (state: MinesweeperState, index: number): MinesweeperState => {
  if (state.statusMap[index] !== 'default') return state;
  let newState: MinesweeperState;
  if (state.gameStatus === 'playing') {
    const newStatus = [...state.statusMap];
    newStatus[index] = 'revealed';
    const bomb = state.contentMap[index] === -1;
    if (bomb) {
      newState = {
        ...state,
        gameStatus: 'fail',
        bombIndex: index,
        statusMap: Array.from(
          { length: state.width * state.height },
          () => 'revealed'
        ),
      };
    } else {
      const revealedCounts = sumUpStatus(state.statusMap, 'revealed');
      const maxRevealedCounts = state.height * state.width - state.minesCount;

      const gamePassed = revealedCounts === maxRevealedCounts - 1;
      if (gamePassed) {
        const statusMap = state.contentMap.map(content =>
          content === -1 ? 'flagged' : 'revealed'
        );
        newState = {
          ...state,
          gameStatus: 'pass',
          statusMap,
          totalFlags: sumUpStatus(statusMap, 'flagged'),
        };
      } else {
        newState = {
          ...state,
          statusMap: newStatus,
        };
      }
    }
  } else {
    // initial
    newState = {
      ...state,
      contentMap: initMap({
        width: state.width,
        height: state.height,
        minesCount: state.minesCount,
        indexEnsureNoMine: index,
      }),
      gameStatus: 'playing',
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
  totalFlags: 0,
  contentMap: Array.from({ length: width * height }, () => 0),
  statusMap: Array.from({ length: width * height }, () => 'default'),
  gameStatus: 'initial',
  bombIndex: undefined,
  // reveal is a recursive function so it need to be declared outside
  reveal: (index: number) => set(state => reveal(state, index)),
  revealAll: (index: number) =>
    set(state => {
      if (state.statusMap[index] === 'revealed') {
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
      if (
        state.gameStatus === 'playing' &&
        state.statusMap[index] !== 'revealed'
      ) {
        const newStatus = [...state.statusMap];
        const flagged = newStatus[index] === 'flagged';
        newStatus[index] = flagged ? 'default' : 'flagged';
        return {
          ...state,
          statusMap: newStatus,
          totalFlags: flagged ? state.totalFlags - 1 : state.totalFlags + 1,
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
      gameStatus: 'initial',
      bombIndex: undefined,
      totalFlags: 0,
    })),
}));

export default useMinesweeperStore;
