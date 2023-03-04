import React from 'react';
import { Status } from '../types';

interface BrickProps {
  content: number;
  status: Status;
}
const Brick = ({ content, status }: BrickProps) => {
  switch (status) {
    case 'revealed':
    case 'flagged':
    default:
      return <div className='w-8 h-8 border border-black' />;
  }
};

export default Brick;
