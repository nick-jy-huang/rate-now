import React from 'react';

interface AmountInputProps {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  label?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  disabled?: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  inputProps,
  label,
  labelProps,
  disabled,
}) => (
  <div className="w-full">
    {label && <label {...labelProps}>{label}</label>}
    <input
      type="number"
      className="w-full rounded border-2 px-3 py-2 text-right focus:outline-none disabled:border-gray-400 disabled:text-gray-400"
      value={value}
      onChange={onChange}
      min={0}
      disabled={disabled}
      {...inputProps}
    />
  </div>
);

export default AmountInput;
