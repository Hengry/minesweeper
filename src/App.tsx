import React, { useMemo } from 'react';
import chunk from 'lodash/chunk';

import useMinesweeperStore from './features/minesweeper/store';
import Brick from './components/Brick';
import Timer from './components/Timer';

const App = () => {
  const { contentMap, width, bombIndex, gameStarted, statusMap, reset } =
    useMinesweeperStore();

  const brickMatrix = useMemo(
    () =>
      chunk(
        contentMap.map((content, index) => ({ content, index })),
        width
      ).map((bricks, rowIndex) => ({ rowIndex, bricks })),
    [contentMap, width]
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
              {bricks.map(({ content, index }) => (
                <Brick
                  key={index}
                  numbering={index}
                  content={content}
                  status={statusMap[index]}
                  bombIndex={bombIndex}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
