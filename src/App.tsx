import React, { useMemo } from 'react';
import chunk from 'lodash/chunk';

import useMinesweeperStore from './features/minesweeper/store';
import Brick from './components/Brick';
import Timer from './components/Timer';

const App = () => {
  const height = useMinesweeperStore(state => state.height);
  const width = useMinesweeperStore(state => state.width);
  const bombIndex = useMinesweeperStore(state => state.bombIndex);
  const gameStarted = useMinesweeperStore(state => state.gameStarted);
  const reset = useMinesweeperStore(state => state.reset);

  const brickMatrix = useMemo(
    () =>
      chunk(
        Array.from({ length: height * width }, (_, index) => index),
        width
      ).map((bricks, rowIndex) => ({ rowIndex, bricks })),
    [height, width]
  );

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='w-fit flex flex-col items-center'>
        <div className='w-full flex my-4'>
          <div className='flex-1' />
          <button type='button' className='text-8xl mx-4' onClick={reset}>
            {typeof bombIndex === 'undefined' ? '😀' : '😵'}
          </button>
          <div className='flex-1 flex flex-col justify-between'>
            <div>
              <div>Timer</div>
              <Timer enabled={gameStarted} />
            </div>
            <div>
              <div>Mine remain</div>
              <div>1</div>
            </div>
          </div>
        </div>

        <div className='border border-gray-500'>
          {brickMatrix.map(({ bricks, rowIndex }) => (
            <div key={rowIndex} className='flex'>
              {bricks.map(index => (
                <Brick key={index} numbering={index} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
