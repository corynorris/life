import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { setSimulation } from "../slices/cellsSlice";
import {
  SimulationType,
  SIMULATION_INFO,
  type SimulationType as SimType,
} from "../core/simulations";

const SIM_ORDER: SimType[] = [
  SimulationType.Life,
  SimulationType.Seeds,
  SimulationType.HighLife,
  SimulationType.DayAndNight,
  SimulationType.Maze,
  SimulationType.BriansBrain,
  SimulationType.Rule30,
  SimulationType.Rule90,
  SimulationType.Rule110,
  SimulationType.LangtonsAnt,
];

const SimulationTabs: FC = () => {
  const active = useSelector((state: RootState) => state.cells.simulation);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="sim-tabs">
      {SIM_ORDER.map((sim) => {
        const info = SIMULATION_INFO[sim];
        return (
          <button
            key={sim}
            className={`sim-tab${sim === active ? " active" : ""}`}
            onClick={() => dispatch(setSimulation(sim))}
            title={info.description}
          >
            <span className="sim-tab-badge">{info.category}</span>
            {info.label}
          </button>
        );
      })}
    </div>
  );
};

export default SimulationTabs;
