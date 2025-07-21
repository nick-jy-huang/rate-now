import React from 'react';

interface SwapButtonProps {
  onClick: () => void;
  className?: string;
  title?: string;
  disabled?: boolean;
}

const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  className,
  title,
  disabled,
}) => (
  <button
    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-4 text-xl text-black duration-300 hover:rotate-180 hover:border-2 hover:border-green-500 hover:text-green-500 disabled:rotate-0 disabled:border-gray-400 disabled:text-gray-400"
    onClick={onClick}
    title={title || '交換幣別'}
    disabled={disabled}
    type="button"
  >
    <span className="fa-solid fa-right-left rotate-90 duration-300 md:rotate-0"></span>
  </button>
);

export default SwapButton;
