import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdateButton from '@/components/UpdateButton';

describe('UpdateButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render in normal state when not loading', () => {
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('刷新');
    expect(button).not.toBeDisabled();
  });

  it('should render loading state when loading is true', () => {
    render(<UpdateButton loading={true} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('更新中...');
    expect(button).toBeDisabled();
  });

  it('should call onClick when clicked in normal state', async () => {
    const user = userEvent.setup();
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    render(<UpdateButton loading={false} disabled={true} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', async () => {
    const user = userEvent.setup();
    render(<UpdateButton loading={true} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should be disabled when explicitly disabled prop is true', () => {
    render(<UpdateButton loading={false} disabled={true} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when loading is true regardless of disabled prop', () => {
    render(<UpdateButton loading={true} disabled={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render upload icon in normal state', () => {
    const { container } = render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const uploadIcon = container.querySelector('span.fa-solid.fa-cloud-arrow-up');
    expect(uploadIcon).toBeInTheDocument();
  });

  it('should render spinner icon in loading state', () => {
    const { container } = render(<UpdateButton loading={true} onClick={mockOnClick} />);

    const spinnerIcon = container.querySelector('span.fa-solid.fa-spinner.animate-spin');
    expect(spinnerIcon).toBeInTheDocument();
  });

  it('should not render upload icon in loading state', () => {
    const { container } = render(<UpdateButton loading={true} onClick={mockOnClick} />);

    const uploadIcon = container.querySelector('span.fa-solid.fa-cloud-arrow-up');
    expect(uploadIcon).not.toBeInTheDocument();
  });

  it('should not render spinner icon in normal state', () => {
    const { container } = render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const spinnerIcon = container.querySelector('span.fa-solid.fa-spinner');
    expect(spinnerIcon).not.toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'h-8',
      'w-auto',
      'cursor-pointer',
      'rounded-md',
      'border',
      'border-2',
      'px-4',
      'py-1',
      'duration-300',
      'hover:border-yellow-500',
      'hover:bg-yellow-500',
      'hover:text-white',
      'disabled:border-gray-400',
      'disabled:text-gray-400',
      'disabled:hover:bg-transparent'
    );
  });

  it('should have correct button type', () => {
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should render loading content with correct structure', () => {
    const { container } = render(<UpdateButton loading={true} onClick={mockOnClick} />);

    const loadingDiv = container.querySelector('div.flex.items-center.gap-2');
    expect(loadingDiv).toBeInTheDocument();
    expect(loadingDiv).toHaveTextContent('更新中...');
  });

  it('should render normal content with correct structure', () => {
    const { container } = render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const normalDiv = container.querySelector('div');
    expect(normalDiv).toHaveTextContent('刷新');
    expect(normalDiv).not.toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should handle keyboard interactions', async () => {
    const user = userEvent.setup();
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should handle space key interaction', async () => {
    const user = userEvent.setup();
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard(' ');

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be focusable when not disabled', () => {
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    button.focus();

    expect(button).toHaveFocus();
  });

  it('should not be focusable when disabled', () => {
    render(<UpdateButton loading={false} disabled={true} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    button.focus();

    expect(button).not.toHaveFocus();
  });

  it('should show Chinese text correctly', () => {
    render(<UpdateButton loading={false} onClick={mockOnClick} />);
    expect(screen.getByText('刷新')).toBeInTheDocument();

    const { rerender } = render(<UpdateButton loading={false} onClick={mockOnClick} />);
    rerender(<UpdateButton loading={true} onClick={mockOnClick} />);
    expect(screen.getByText('更新中...')).toBeInTheDocument();
  });

  it('should maintain consistent styling between states', () => {
    const { rerender } = render(<UpdateButton loading={false} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    const initialClasses = button.className;
    
    rerender(<UpdateButton loading={true} onClick={mockOnClick} />);
    
    expect(button).toHaveClass('h-8', 'w-auto', 'rounded-md', 'border', 'px-4', 'py-1');
  });

  it('should handle rapid state changes', () => {
    const { rerender } = render(<UpdateButton loading={false} onClick={mockOnClick} />);
    
    expect(screen.getByText('刷新')).toBeInTheDocument();
    
    rerender(<UpdateButton loading={true} onClick={mockOnClick} />);
    expect(screen.getByText('更新中...')).toBeInTheDocument();
    
    rerender(<UpdateButton loading={false} onClick={mockOnClick} />);
    expect(screen.getByText('刷新')).toBeInTheDocument();
  });

  it('should handle both disabled and loading states correctly', () => {
    render(<UpdateButton loading={true} disabled={true} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('更新中...');
  });

  it('should have hover effects when not disabled', () => {
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'hover:border-yellow-500',
      'hover:bg-yellow-500',
      'hover:text-white'
    );
  });

  it('should handle multiple rapid clicks', async () => {
    const user = userEvent.setup();
    render(<UpdateButton loading={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await user.tripleClick(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });
});