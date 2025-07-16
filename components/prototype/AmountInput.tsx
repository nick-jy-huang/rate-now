import React from 'react';

interface AmountInputProps {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  label?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  inputProps,
  label,
  labelProps,
}) => (
  <div className="w-full">
    {label && <label {...labelProps}>{label}</label>}
    <input
      type="number"
      className="w-full rounded border-2 px-3 py-2 text-right"
      value={value}
      onChange={onChange}
      min={0}
      {...inputProps}
    />
  </div>
);

export default AmountInput; 