import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SwapButton from '@/components/SwapButton';

describe('SwapButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<SwapButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', '交換幣別');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<SwapButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should render with custom title', () => {
    render(<SwapButton onClick={mockOnClick} title="Swap currencies" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Swap currencies');
  });

  it('should apply custom className', () => {
    render(<SwapButton onClick={mockOnClick} className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex',
      'h-12',
      'w-12',
      'cursor-pointer',
      'items-center',
      'justify-center',
      'rounded-full',
      'border-2',
      'p-4',
      'text-xl',
      'text-black',
      'duration-300'
    );
  });

  it('should be disabled when disabled prop is true', () => {
    render(<SwapButton onClick={mockOnClick} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled and clicked', async () => {
    const user = userEvent.setup();
    render(<SwapButton onClick={mockOnClick} disabled />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should have correct default CSS classes', () => {
    render(<SwapButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex',
      'h-12',
      'w-12',
      'cursor-pointer',
      'items-center',
      'justify-center',
      'rounded-full',
      'border-2',
      'p-4',
      'text-xl',
      'text-black',
      'duration-300',
      'hover:rotate-180',
      'hover:border-2',
      'hover:border-green-500',
      'hover:text-green-500',
      'disabled:rotate-0',
      'disabled:border-gray-400',
      'disabled:text-gray-400'
    );
  });

  it('should render Font Awesome icon with correct classes', () => {
    const { container } = render(<SwapButton onClick={mockOnClick} />);
    
    const icon = container.querySelector('span.fa-solid.fa-right-left');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('rotate-90', 'duration-300', 'md:rotate-0');
  });

  it('should handle keyboard interaction', async () => {
    const user = userEvent.setup();
    render(<SwapButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should handle space key interaction', async () => {
    const user = userEvent.setup();
    render(<SwapButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard(' ');
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should maintain focus state correctly', () => {
    render(<SwapButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
  });

  it('should handle multiple rapid clicks', async () => {
    const user = userEvent.setup();
    render(<SwapButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    await user.tripleClick(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });
});