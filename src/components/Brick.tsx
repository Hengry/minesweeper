import React from 'react';
import { twMerge } from 'tailwind-merge';
import useMinesweeperStore from '../features/minesweeper/store';

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

  const handleClick = () => {
    reveal(numbering);
  };
  const handleDoubleClick = () => {
    if (status === 'revealed') revealAll(numbering);
  };
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    flag(numbering);
  };
  const bombed = bombIndex === numbering;
  return (
    <button
      aria-label='brick'
      className={twMerge(
        'min-w-[32px] min-h-[32px] border-2 text-lg text-white bg-gray-400',
        status === 'default' && 'active:border-gray-600 active:border',
        status === 'revealed'
          ? 'border border-gray-600'
          : 'border-l-gray-100 border-t-gray-100 border-r-gray-600 border-b-gray-600',
        bombed && 'bg-red-600'
      )}
      type='button'
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
      disabled={typeof bombIndex !== 'undefined'}
    >
      {(status === 'revealed' && (content === -1 ? '💣' : content)) || null}
      {status === 'flagged' && '🚩'}
    </button>
  );
};

export default Brick;
