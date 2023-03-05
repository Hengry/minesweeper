import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  status: 'initial' | 'playing' | 'stop';
}
const Timer = ({ status }: TimerProps) => {
  const [time, setTime] = useState(0);
  const intervalJob = useRef<NodeJS.Timer>();
  useEffect(() => {
    switch (status) {
      case 'playing':
        setTime(0);
        intervalJob.current = setInterval(() => {
          setTime(prev => prev + 1);
        }, 1000);
        break;
      case 'initial':
        setTime(0);
        break;
      case 'stop':
      default:
    }
    return () => {
      clearInterval(intervalJob.current);
    };
  }, [status]);
  return <div>{time}</div>;
};

export default Timer;
