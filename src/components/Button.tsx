import { FC } from "react";

interface ButtonProps {
  message: string;
  handleClick: () => void;
}

const Button: FC<ButtonProps> = ({ message, handleClick }) => {
  return <button onClick={handleClick}>{message}</button>;
};

export default Button;
