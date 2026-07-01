import React from "react";
import { useSelector } from "react-redux";

const Generation = () => {
  const generations = useSelector((state) => state.generations);

  return <div>{generations}</div>;
};

export default Generation;
