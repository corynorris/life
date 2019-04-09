import React from "react";

const Button = ({ message, handleClick }) => {
  return <button onClick={handleClick}>{message}</button>;
};

export default Button;
