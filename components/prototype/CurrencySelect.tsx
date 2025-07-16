import React from 'react';

interface CurrencySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  getOptionLabel?: (code: string) => string;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  options,
  label,
  labelProps,
  selectProps,
  getOptionLabel = (code) => code,
}) => (
  <div className="relative w-full">
    {label && <label {...labelProps}>{label}</label>}
    <select
      className="mb-2 h-11 w-full appearance-none rounded border-2 px-3 py-2"
      value={value}
      onChange={onChange}
      {...selectProps}
    >
      {options.map((code) => (
        <option key={code} value={code}>
          {getOptionLabel(code)}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute top-6 right-4 -translate-y-3 text-black">
      <i className="fa-solid fa-chevron-down"></i>
    </span>
  </div>
);

export default CurrencySelect; 