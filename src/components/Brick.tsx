import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { Status } from '../types';

interface BrickProps {
  content: number;
  status: Status;
  numbering: number;
  bombed: boolean;
  onClick: (numbering: number) => void;
  onRightClick: (numbering: number) => void;
}
const Brick = ({
  content,
  status,
  numbering,
  bombed,
  onClick,
  onRightClick,
}: BrickProps) => {
  const handleClick = () => {
    onClick(numbering);
  };
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRightClick(numbering);
  };

  return (
    <button
      aria-label='brick'
      className={twMerge(
        'w-8 h-8 border-2 text-lg text-white',
        status === 'revealed'
          ? 'border-gray-700 bg-gray-500'
          : 'border-l-gray-100 border-t-gray-100 border-r-gray-700 border-b-gray-700 bg-gray-400',
        bombed && 'bg-red-600'
      )}
      type='button'
      onClick={handleClick}
      onContextMenu={handleRightClick}
      disabled={status === 'revealed'}
    >
      {(status === 'revealed' && (content === -1 ? '💣' : content)) || null}
      {status === 'flagged' && '🚩'}
    </button>
  );
};

export default Brick;
