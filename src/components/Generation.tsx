import { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Generation: FC = () => {
  const generations = useSelector((state: RootState) => state.generations);

  return <div>{generations}</div>;
};

export default Generation;
