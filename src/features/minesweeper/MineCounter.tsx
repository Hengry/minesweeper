import useMinesweeperStore from './store';

const MineCounter = () => {
  const totalFlags = useMinesweeperStore(state => state.totalFlags);
  const minesCount = useMinesweeperStore(state => state.minesCount);
  return <div>{minesCount - totalFlags}</div>;
};

export default MineCounter;
