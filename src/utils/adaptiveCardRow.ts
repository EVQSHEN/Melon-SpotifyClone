const adaptiveCardRow = (
  gridRowLength: number,
  setGridRowLength: React.Dispatch<React.SetStateAction<number>>,
) => {
  const width = window.innerWidth;
  if (width >= 1280 && gridRowLength !== 7) {
    setGridRowLength(7);
  } else if (width >= 1024 && width < 1280 && gridRowLength !== 6) {
    setGridRowLength(6);
  } else if (width >= 768 && width < 1024 && gridRowLength !== 5) {
    setGridRowLength(5);
  } else if (width >= 640 && width < 768 && gridRowLength !== 3) {
    setGridRowLength(7);
  }
};

export default adaptiveCardRow;
