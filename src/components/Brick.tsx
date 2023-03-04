import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { Status } from '../types';

interface BrickProps {
  content: number;
  status: Status;
  numbering: number;
  onClick: (numbering: number) => void;
  onDoubleClick: (numbering: number) => void;
  onRightClick: (numbering: number) => void;
  bombIndex?: number;
}
const Brick = ({
  content,
  status,
  numbering,
  bombIndex,
  onClick,
  onDoubleClick,
  onRightClick,
}: BrickProps) => {
  const handleClick = () => {
    onClick(numbering);
  };
  const handleDoubleClick = () => {
    if (status === 'revealed') onDoubleClick(numbering);
  };
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRightClick(numbering);
  };
  const bombed = bombIndex === numbering;
  return (
    <button
      aria-label='brick'
      className={twMerge(
        'min-w-[32px] min-h-[32px] border-2 text-lg text-white bg-gray-400',
        'active:border-gray-600 active:border',
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
