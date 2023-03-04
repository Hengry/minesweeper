import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { Status } from '../types';

interface BrickProps {
  content: number;
  status: Status;
  numbering: number;
  onClick: (numbering: number) => void;
}
const Brick = ({ content, status, numbering, onClick }: BrickProps) => {
  const handleClick = () => {
    onClick(numbering);
  };
  return (
    <button
      aria-label='brick'
      className={twMerge(
        'w-8 h-8 border-2 text-lg text-white',
        status === 'default'
          ? 'border-l-gray-100 border-t-gray-100 border-r-gray-700 border-b-gray-700 bg-gray-400'
          : 'border-gray-700 bg-gray-500'
      )}
      type='button'
      onClick={handleClick}
      disabled={status === 'revealed'}
    >
      {(status === 'revealed' && content) || null}
    </button>
  );
};

export default Brick;
