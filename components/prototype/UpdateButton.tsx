import React from 'react';

interface UpdateButtonProps {
  loading: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ loading, onClick, className, disabled }) => (
  <button
    className={`h-8 w-auto cursor-pointer rounded-md border px-3 py-1 duration-300 hover:bg-yellow-500 hover:text-white ${className || ''}`}
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