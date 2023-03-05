import React from 'react';
import { twMerge } from 'tailwind-merge';
import useMinesweeperStore from './store';

interface BrickProps {
  numbering: number;
}
const Brick = ({ numbering }: BrickProps) => {
  const reveal = useMinesweeperStore(state => state.reveal);
  const revealAll = useMinesweeperStore(state => state.revealAll);
  const flag = useMinesweeperStore(state => state.flag);
  const content = useMinesweeperStore(state => state.contentMap[numbering]);
  const status = useMinesweeperStore(state => state.statusMap[numbering]);
  const bombIndex = useMinesweeperStore(state => state.bombIndex);
  const gameStatus = useMinesweeperStore(state => state.gameStatus);

  const handleClick = () => {
    reveal(numbering);
  };
  const handleDoubleClick = () => {
    revealAll(numbering);
  };
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    flag(numbering);
  };
  const bombed = gameStatus === 'fail' && bombIndex === numbering;
  const gameEnd = gameStatus === 'fail' || gameStatus === 'pass';
  return (
    <button
      aria-label='brick'
      className={twMerge(
        'min-w-[32px] min-h-[32px] border-2 text-lg text-white bg-gray-400',
        status === 'default' && 'active:border-gray-600 active:border',
        status === 'revealed'
          ? 'border border-gray-600'
          : 'border-l-gray-100 border-t-gray-100 border-r-gray-600 border-b-gray-600',
        bombed && 'bg-red-600',
        !gameEnd && 'hover:bg-stone-300'
      )}
      type='button'
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
      disabled={gameEnd}
    >
      {(status === 'revealed' && (content === -1 ? '💣' : content)) || null}
      {status === 'flagged' && '🚩'}
    </button>
  );
};

export default React.memo(Brick);
