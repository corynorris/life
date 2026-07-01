import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "./Button";
import { stepForward, makeGrid, makeRandomGrid } from "../slices/cellsSlice";
import { setIntervalId } from "../slices/intervalSlice";

const Controls = () => {
  const interval = useSelector((state) => state.interval);
  const dispatch = useDispatch();

  const onNextClick = useCallback(() => {
    dispatch(stepForward());
  }, [dispatch]);

  const onPlayToggle = useCallback(() => {
    if (interval === 0) {
      const id = setInterval(onNextClick, 200);
      dispatch(setIntervalId(id));
    } else {
      clearInterval(interval);
      dispatch(setIntervalId(0));
    }
  }, [interval, onNextClick, dispatch]);

  // Auto-play on mount
  useEffect(() => {
    const id = setInterval(() => dispatch(stepForward()), 200);
    dispatch(setIntervalId(id));
    return () => {
      clearInterval(id);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Button
        message="randomize"
        handleClick={() => dispatch(makeRandomGrid())}
      />
      <Button message="reset" handleClick={() => dispatch(makeGrid())} />
      <Button
        message={interval ? "pause" : "play"}
        handleClick={onPlayToggle}
      />
      <Button message="next" handleClick={onNextClick} />
    </div>
  );
};

export default Controls;
