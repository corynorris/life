import { FC, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import Button from "./Button";
import {
	stepForward,
	makeGrid,
	makeRandomGrid,
	setGridSize,
	GRID_SIZE_PRESETS,
} from "../slices/cellsSlice";
import { setIntervalId } from "../slices/intervalSlice";

const Controls: FC = () => {
	const interval = useSelector((state: RootState) => state.interval);
	const gridWidth = useSelector((state: RootState) => state.cells.gridWidth);
	const gridHeight = useSelector((state: RootState) => state.cells.gridHeight);
	const dispatch = useDispatch<AppDispatch>();

	const onNextClick = useCallback(() => {
		dispatch(stepForward());
	}, [dispatch]);

	const onPlayToggle = useCallback(() => {
		if (interval === 0) {
			const id = window.setInterval(onNextClick, 200);
			dispatch(setIntervalId(id));
		} else {
			clearInterval(interval);
			dispatch(setIntervalId(0));
		}
	}, [interval, onNextClick, dispatch]);

	// Auto-play on mount
	useEffect(() => {
		const id = window.setInterval(() => dispatch(stepForward()), 200);
		dispatch(setIntervalId(id));
		return () => {
			clearInterval(id);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div className="controls-row">
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

			<div className="grid-size-row">
				<span className="grid-size-label">Grid:</span>
				{GRID_SIZE_PRESETS.map((preset) => {
					const active =
						gridWidth === preset.width && gridHeight === preset.height;
					return (
						<button
							key={preset.label}
							className={`size-btn${active ? " active" : ""}`}
							onClick={() =>
								dispatch(
									setGridSize({ width: preset.width, height: preset.height }),
								)
							}
						>
							{preset.label}
							<span className="size-dims">
								{preset.width}×{preset.height}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default Controls;
