import React, { useState, useEffect } from 'react';

const Timer = ({ enabled }: { enabled: boolean }) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!enabled) return () => {};
    setTime(0);
    const intervalJob = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(intervalJob);
    };
  }, [enabled]);
  return <div>{enabled ? time : 0}</div>;
};

export default Timer;

const useTimer = () => ({
  Timer,
});
