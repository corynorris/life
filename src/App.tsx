import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { SIMULATION_INFO } from "./core/simulations";
import "./App.css";
import SimulationTabs from "./components/SimulationTabs";
import Controls from "./components/Controls";
import Generation from "./components/Generation";
import Grid from "./components/Grid";
import SimulationInfo from "./components/SimulationInfo";

const App = () => {
	const simulation = useSelector((state: RootState) => state.cells.simulation);

	return (
		<div className="App">
			<h1 className="App-intro">{SIMULATION_INFO[simulation].label}</h1>
			<SimulationTabs />
			<Grid />
			<Controls />
			<Generation />
			<SimulationInfo />
		</div>
	);
};

export default App;
