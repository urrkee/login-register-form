import React from 'react';

type ButtonProps = {
  name: string;
  className?: string;
};

const button: React.FC<ButtonProps> = ({ name, className }) => {
  return (
    <button
      className={`bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 rounded-[6px] 
    focus:border-sky-50 focus:outline-2 focus:outline-offset-2 focus:outline-[#6366F1] flex text-center items-center justify-center font-medium ${className}`}
    >
      {name}
    </button>
  );
};

export default button;
