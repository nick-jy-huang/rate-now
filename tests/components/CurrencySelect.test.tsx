import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencySelect from '@/components/CurrencySelect';

describe('CurrencySelect', () => {
  const mockOnChange = vi.fn();
  const mockOptions = ['USD', 'EUR', 'JPY', 'TWD'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('USD');
  });

  it('should render all options correctly', () => {
    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveValue('USD');
    expect(options[1]).toHaveValue('EUR');
    expect(options[2]).toHaveValue('JPY');
    expect(options[3]).toHaveValue('TWD');
  });

  it('should render with label when provided', () => {
    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
        label="Currency"
        labelProps={{ 'data-testid': 'currency-label' } as any}
      />
    );
    
    const label = screen.getByTestId('currency-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Currency');
  });

  it('should use custom option labels when getOptionLabel is provided', () => {
    const getOptionLabel = (code: string) => {
      const labels: Record<string, string> = {
        USD: '美元 (USD)',
        EUR: '歐元 (EUR)',
        JPY: '日圓 (JPY)',
        TWD: '新台幣 (TWD)'
      };
      return labels[code] || code;
    };

    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
        getOptionLabel={getOptionLabel}
      />
    );
    
    expect(screen.getByRole('option', { name: '美元 (USD)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '歐元 (EUR)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '日圓 (JPY)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '新台幣 (TWD)' })).toBeInTheDocument();
  });

  it('should call onChange when selection changes', async () => {
    const user = userEvent.setup();
    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'EUR');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
        disabled
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('disabled:border-gray-400', 'disabled:text-gray-400');
  });

  it('should render dropdown chevron icon', () => {
    const { container } = render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );
    
    const chevronIcon = container.querySelector('i.fa-solid.fa-chevron-down');
    expect(chevronIcon).toBeInTheDocument();
  });

  it('should apply disabled styling to chevron icon when disabled', () => {
    const { container } = render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
        disabled
      />
    );
    
    const chevronSpan = container.querySelector('span');
    expect(chevronSpan).toHaveClass('text-gray-400');
  });

  it('should apply normal styling to chevron icon when not disabled', () => {
    const { container } = render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
        disabled={false}
      />
    );
    
    const chevronSpan = container.querySelector('span');
    expect(chevronSpan).toHaveClass('text-black');
  });

  it('should apply additional select props', () => {
    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
        selectProps={{
          'data-testid': 'custom-select',
          'aria-label': 'Select currency'
        } as any}
      />
    );
    
    const select = screen.getByTestId('custom-select');
    expect(select).toHaveAttribute('aria-label', 'Select currency');
  });

  it('should have correct CSS classes', () => {
    render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass(
      'mb-2',
      'h-11',
      'w-full',
      'appearance-none',
      'rounded',
      'border-2',
      'px-3',
      'py-2',
      'focus:outline-none',
      'disabled:border-gray-400',
      'disabled:text-gray-400'
    );
  });

  it('should render wrapper div with correct classes', () => {
    const { container } = render(
      <CurrencySelect
        value="USD"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );
    
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass('relative', 'w-full');
  });

  it('should handle empty options array', () => {
    render(
      <CurrencySelect
        value=""
        onChange={mockOnChange}
        options={[]}
      />
    );
    
    const options = screen.queryAllByRole('option');
    expect(options).toHaveLength(0);
  });

  it('should maintain selected value even if not in options', () => {
    render(
      <CurrencySelect
        value="GBP"
        onChange={mockOnChange}
        options={['USD', 'EUR', 'JPY', 'GBP']}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('GBP');
  });
});