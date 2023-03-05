import { useMemo } from 'react';
import chunk from 'lodash/chunk';

import useMinesweeperStore from './store';
import Brick from './Brick';
import Timer from '../../components/Timer';
import MineCounter from './MineCounter';

const Minesweeper = () => {
  const height = useMinesweeperStore(state => state.height);
  const width = useMinesweeperStore(state => state.width);
  const reset = useMinesweeperStore(state => state.reset);
  const gameStatus = useMinesweeperStore(state => state.gameStatus);

  const brickMatrix = useMemo(
    () =>
      chunk(
        Array.from({ length: height * width }, (_, index) => index),
        width
      ).map((bricks, rowIndex) => ({ rowIndex, bricks })),
    [height, width]
  );

  return (
    <div className='w-fit flex flex-col items-center'>
      <div className='w-full flex my-4'>
        <div className='flex-1' />
        <button type='button' className='text-8xl mx-4' onClick={reset}>
          {{ initial: '😀', playing: '🫣', fail: '😵', goal: '🤩' }[gameStatus]}
        </button>
        <div className='flex-1 flex flex-col justify-between text-right'>
          <div>
            <div>Time</div>
            <Timer
              status={
                gameStatus === 'fail' || gameStatus === 'goal'
                  ? 'stop'
                  : gameStatus
              }
            />
          </div>
          <div>
            <div>Mine remain</div>
            <MineCounter />
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
  );
};

export default Minesweeper;
