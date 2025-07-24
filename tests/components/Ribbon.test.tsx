import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Ribbon from '@/components/Ribbon';

describe('Ribbon', () => {
  const defaultProps = {
    href: 'https://example.com',
    children: 'Test Ribbon'
  };

  it('should render with correct href and children', () => {
    render(<Ribbon {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('Test Ribbon');
  });

  it('should render with Chinese text content', () => {
    render(<Ribbon href="https://tw.rter.info">資料來源</Ribbon>);

    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('資料來源');
    expect(link).toHaveAttribute('href', 'https://tw.rter.info');
  });

  it('should have correct link attributes for external links', () => {
    render(<Ribbon {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render Font Awesome external link icon', () => {
    const { container } = render(<Ribbon {...defaultProps} />);

    const icon = container.querySelector('i.fa-solid.fa-arrow-up-right-from-square');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('ml-2', 'text-xs');
  });

  it('should have correct wrapper div structure and classes', () => {
    const { container } = render(<Ribbon {...defaultProps} />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'pointer-events-auto',
      'absolute',
      'top-0',
      'left-0',
      'z-10',
      'h-[140px]',
      'w-[140px]',
      'overflow-hidden'
    );
  });

  it('should have correct link styling classes', () => {
    render(<Ribbon {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'absolute',
      'top-8',
      'left-[-2.5rem]',
      'w-[170px]',
      '-rotate-45',
      'bg-green-600',
      'py-1',
      'text-center',
      'text-sm',
      'font-bold',
      'tracking-wider',
      'text-white',
      'duration-200',
      'hover:scale-110'
    );
  });

  it('should handle different URLs correctly', () => {
    const urls = [
      'https://example.com',
      'http://example.com', 
      'https://sub.example.com/path',
      'https://example.com/path?query=value#anchor'
    ];

    urls.forEach((url, index) => {
      const { unmount } = render(
        <Ribbon href={url}>Link {index}</Ribbon>
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', url);
      unmount();
    });
  });

  it('should render multiple children correctly', () => {
    render(
      <Ribbon href="https://example.com">
        <span>Multi</span>
        <span>Children</span>
      </Ribbon>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('MultiChildren');
    expect(link.children).toHaveLength(3);
  });

  it('should be clickable and accessible', async () => {
    const user = userEvent.setup();
    render(<Ribbon {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    
    await user.tab();
    expect(link).toHaveFocus();
  });

  it('should handle empty children', () => {
    render(<Ribbon href="https://example.com" />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    const icon = link.querySelector('i.fa-solid.fa-arrow-up-right-from-square');
    expect(icon).toBeInTheDocument();
  });

  it('should handle string children', () => {
    render(<Ribbon href="https://example.com">Simple Text</Ribbon>);

    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Simple Text');
  });

  it('should handle React node children', () => {
    render(
      <Ribbon href="https://example.com">
        <div>Complex Content</div>
      </Ribbon>
    );

    const link = screen.getByRole('link');
    expect(screen.getByText('Complex Content')).toBeInTheDocument();
  });

  it('should maintain correct positioning and styling', () => {
    const { container } = render(<Ribbon {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    const link = screen.getByRole('link');

    expect(wrapper).toHaveClass('absolute', 'top-0', 'left-0');
    
    expect(link).toHaveClass('absolute', 'top-8', 'left-[-2.5rem]', '-rotate-45');
  });

  it('should have hover effects', () => {
    render(<Ribbon {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:scale-110', 'duration-200');
  });

  it('should work with different protocols', () => {
    const protocols = ['https://example.com', 'http://example.com', 'mailto:test@example.com'];

    protocols.forEach((href, index) => {
      const { unmount } = render(
        <Ribbon href={href}>Protocol Test {index}</Ribbon>
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', href);
      unmount();
    });
  });

  it('should be properly sized for ribbon effect', () => {
    const { container } = render(<Ribbon {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    const link = screen.getByRole('link');

    expect(wrapper).toHaveClass('h-[140px]', 'w-[140px]');
    
    expect(link).toHaveClass('w-[170px]');
  });
});