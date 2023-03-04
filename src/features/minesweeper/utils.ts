import sampleSize from 'lodash/sampleSize';

export const getAdjacentIndices = (
  index: number,
  width: number,
  height: number
) => {
  const fullAdjacents = [
    index - width - 1,
    index - width,
    index - width + 1,
    index - 1,
    index + 1,
    index + width - 1,
    index + width,
    index + width + 1,
  ];
  if (index < width) {
    fullAdjacents[0] = -1;
    fullAdjacents[1] = -1;
    fullAdjacents[2] = -1;
  } else if (index >= width * (height - 1)) {
    fullAdjacents[5] = -1;
    fullAdjacents[6] = -1;
    fullAdjacents[7] = -1;
  }
  if (index % width === 0) {
    fullAdjacents[0] = -1;
    fullAdjacents[3] = -1;
    fullAdjacents[5] = -1;
  } else if (index % width === height - 1) {
    fullAdjacents[2] = -1;
    fullAdjacents[4] = -1;
    fullAdjacents[7] = -1;
  }
  return fullAdjacents.filter(i => i !== -1);
};

interface InitMap {
  width: number;
  height: number;
  minesCount: number;
  indexEnsureNoMine: number;
}
export const initMap = ({
  width,
  height,
  minesCount,
  indexEnsureNoMine,
}: InitMap) => {
  const numbering = Array.from({ length: width * height - 1 }, (_, i) => i);
  const mines: number[] = sampleSize(numbering, minesCount);
  const minesMap = numbering.map(index => +mines.includes(index));
  minesMap.splice(indexEnsureNoMine, 0, 0);
  return minesMap.map((_, index) => {
    if (minesMap[index]) return -1;
    return getAdjacentIndices(index, width, height).reduce(
      (sum, i) => sum + minesMap[i] || 0,
      0
    );
  });
};
