import { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { SIMULATION_INFO } from "../core/simulations";

const SimulationInfo: FC = () => {
	const sim = useSelector((state: RootState) => state.cells.simulation);
	const info = SIMULATION_INFO[sim];

	return (
		<div className="sim-info">
			<p className="sim-info-desc">{info.description}</p>
			<p className="sim-info-rules">
				<strong>Rules:</strong> {info.rules}
			</p>
			<p className="sim-info-link">
				<a href={info.wikiUrl} target="_blank" rel="noopener noreferrer">
					Wikipedia →
				</a>
			</p>
		</div>
	);
};

export default SimulationInfo;
