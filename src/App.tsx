import React, { useCallback, useMemo, useReducer } from 'react';
import chunk from 'lodash/chunk';

import { reducer, initialState } from './minesweeperReducer';
import Brick from './components/Brick';
import Timer from './components/Timer';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleClick = useCallback((numbering: number) => {
    dispatch({ type: 'reveal', payload: numbering });
  }, []);

  const handleDoubleClick = useCallback((numbering: number) => {
    dispatch({ type: 'revealAll', payload: numbering });
  }, []);

  const handleRightClick = useCallback((numbering: number) => {
    dispatch({ type: 'flag', payload: numbering });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const brickMatrix = useMemo(
    () =>
      chunk(
        state.contentMap.map((content, index) => ({ content, index })),
        state.width
      ).map((bricks, rowIndex) => ({ rowIndex, bricks })),
    [state.contentMap, state.width]
  );

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='w-fit flex flex-col items-center'>
        <div className='w-full flex my-4'>
          <div className='flex-1' />
          <button type='button' className='text-8xl mx-4' onClick={handleReset}>
            {typeof state.bombIndex === 'undefined' ? '😀' : '😵'}
          </button>
          <div className='flex-1 flex flex-col justify-between'>
            <div>
              <div>Timer</div>
              <Timer enabled={state.gameStarted} />
            </div>
            <div>
              <div>Mine remain</div>
              <div>1</div>
            </div>
          </div>
        </div>

        <div className='border border-gray-500'>
          {brickMatrix.map(({ bricks, rowIndex }) => (
            <div key={rowIndex} className='flex'>
              {bricks.map(({ content, index }) => (
                <Brick
                  key={index}
                  numbering={index}
                  content={content}
                  status={state.statusMap[index]}
                  onClick={handleClick}
                  onDoubleClick={handleDoubleClick}
                  onRightClick={handleRightClick}
                  bombIndex={state.bombIndex}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
