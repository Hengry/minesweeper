import React from 'react';
import { twMerge } from 'tailwind-merge';
import useMinesweeperStore from '../features/minesweeper/store';
import { Status } from '../features/minesweeper/types';

interface BrickProps {
  content: number;
  status: Status;
  numbering: number;
  bombIndex?: number;
}
const defaultProps = {
  bombIndex: undefined,
};
const Brick = ({ content, status, numbering, bombIndex }: BrickProps) => {
  const reveal = useMinesweeperStore(state => state.reveal);
  const revealAll = useMinesweeperStore(state => state.revealAll);
  const flag = useMinesweeperStore(state => state.flag);
  console.log('render');
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
Brick.defaultProps = defaultProps;

export default React.memo(Brick);
