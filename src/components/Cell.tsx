import { FC } from "react";
import {
	SimulationType,
	type SimulationType as SimType,
} from "../core/simulations";

import "./Cell.css";

function getClass(state: number, simulation: SimType, isAnt: boolean): string {
	if (isAnt) return "ant";

	switch (simulation) {
		case SimulationType.Life:
			if (state === 0) return "dead";
			if (state === 2) return "born";
			return "alive";

		case SimulationType.BriansBrain:
			if (state === 0) return "bb-off";
			if (state === 1) return "bb-on";
			return "bb-dying";

		case SimulationType.LangtonsAnt:
			return state === 0 ? "dead" : "ant-alive";

		case SimulationType.Rule30:
		case SimulationType.Rule90:
		case SimulationType.Rule110:
			return state === 0 ? "dead" : "ca-alive";

		// Life-like: Seeds, HighLife, Day & Night, Maze
		default:
			return state === 0 ? "dead" : "alive";
	}
}

interface CellProps {
	onCellClick: () => void;
	state: number;
	simulation: SimType;
	isAnt: boolean;
}

const Cell: FC<CellProps> = ({ onCellClick, state, simulation, isAnt }) => (
	<td onClick={onCellClick} className={getClass(state, simulation, isAnt)} />
);

export default Cell;
