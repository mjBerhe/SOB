interface Props {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<Props> = ({ children, onClick, className }) => {
  return (
    <button
      className={`outline-none border border-white p-2 rounded-lg hover:bg-gray-500 ${
        className ? className : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
