import React from 'react';

interface UpdateButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({
  loading,
  disabled,
  onClick,
}) => (
  <button
    className="h-8 w-auto cursor-pointer rounded-md border border-2 px-4 py-1 duration-300 hover:border-yellow-500 hover:bg-yellow-500 hover:text-white disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-transparent"
    onClick={onClick}
    disabled={disabled || loading}
    type="button"
  >
    {loading ? (
      <div className="flex items-center gap-2">
        更新中...
        <span className="fa-solid fa-spinner animate-spin"></span>
      </div>
    ) : (
      <div>
        刷新 <span className="fa-solid fa-cloud-arrow-up"></span>
      </div>
    )}
  </button>
);

export default UpdateButton;
