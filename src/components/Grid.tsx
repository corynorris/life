import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spawnCell, computeCellSize } from "../slices/cellsSlice";
import type { RootState, AppDispatch } from "../store";

import Cell from "./Cell";
import "./Grid.css";

const Grid: FC = () => {
	const cells = useSelector((state: RootState) => state.cells);
	const dispatch = useDispatch<AppDispatch>();

	const cellSize = computeCellSize(cells.gridWidth, cells.gridHeight);

	const handleCellClick = (x: number, y: number) => {
		dispatch(spawnCell({ x, y }));
	};

	const rows = cells.grid.map((row, y) => {
		return (
			<tr key={y}>
				{row.map((state, x) => {
					return (
						<Cell
							key={x}
							state={state}
							simulation={cells.simulation}
							isAnt={
								cells.simulation === "langtonsant" &&
								cells.ant.x === x &&
								cells.ant.y === y
							}
							onCellClick={() => handleCellClick(x, y)}
						/>
					);
				})}
			</tr>
		);
	});

	return (
		<table
			className="center"
			style={{ "--cell-size": `${cellSize}px` } as React.CSSProperties}
		>
			<tbody>{rows}</tbody>
		</table>
	);
};

export default Grid;
