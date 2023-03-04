import React, { useCallback } from 'react';
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
      className='w-8 h-8 border border-black'
      type='button'
      onClick={handleClick}
    >
      {status === 'revealed' ? content : null}
    </button>
  );
};

export default Brick;
