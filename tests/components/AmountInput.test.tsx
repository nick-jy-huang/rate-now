import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmountInput from '@/components/AmountInput';

describe('AmountInput', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<AmountInput value={100} onChange={mockOnChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(100);
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
  });

  it('should render with label when provided', () => {
    render(
      <AmountInput
        value={50}
        onChange={mockOnChange}
        label="Amount"
        labelProps={{ 'data-testid': 'amount-label' } as any}
      />
    );
    
    const label = screen.getByTestId('amount-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Amount');
  });

  it('should handle string values', () => {
    render(<AmountInput value="123.45" onChange={mockOnChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(123.45);
  });

  it('should call onChange when input value changes', async () => {
    const user = userEvent.setup();
    render(<AmountInput value={0} onChange={mockOnChange} />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '250');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<AmountInput value={100} onChange={mockOnChange} disabled />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:border-gray-400', 'disabled:text-gray-400');
  });

  it('should not be disabled when disabled prop is false', () => {
    render(<AmountInput value={100} onChange={mockOnChange} disabled={false} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).not.toBeDisabled();
  });

  it('should apply additional input props', () => {
    render(
      <AmountInput
        value={100}
        onChange={mockOnChange}
        inputProps={{
          'data-testid': 'custom-input',
          placeholder: 'Enter amount',
          step: '0.01'
        } as any}
      />
    );
    
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('placeholder', 'Enter amount');
    expect(input).toHaveAttribute('step', '0.01');
  });

  it('should have correct CSS classes', () => {
    render(<AmountInput value={100} onChange={mockOnChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass(
      'w-full',
      'rounded',
      'border-2',
      'px-3',
      'py-2',
      'text-right',
      'focus:outline-none',
      'disabled:border-gray-400',
      'disabled:text-gray-400'
    );
  });

  it('should render wrapper div with correct class', () => {
    const { container } = render(<AmountInput value={100} onChange={mockOnChange} />);
    
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass('w-full');
  });

  it('should handle focus events correctly', () => {
    render(<AmountInput value={100} onChange={mockOnChange} />);
    
    const input = screen.getByRole('spinbutton');
    input.focus();
    
    expect(input).toHaveFocus();
  });

  it('should accept empty value', () => {
    render(<AmountInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(null);
  });

  it('should handle decimal values correctly', () => {
    render(<AmountInput value={123.456} onChange={mockOnChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(123.456);
  });
});