import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RateDisplay from '@/components/RateDisplay';

vi.mock('react-countup', () => ({
  default: ({ end, decimals }: { end: number; decimals: number }) => (
    <span data-testid="countup">{end.toFixed(decimals)}</span>
  )
}));

vi.mock('@/constants', () => ({
  SYMBOLS: {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    TWD: 'NT$',
    HKD: 'HK$',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$',
    CNY: '¥'
  }
}));

describe('RateDisplay', () => {
  it('should render rate display correctly when no error', () => {
    render(
      <RateDisplay
        from="USD"
        to="TWD"
        rate={32.5}
      />
    );
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('(USD)')).toBeInTheDocument();
    expect(screen.getByText('≈')).toBeInTheDocument();
    expect(screen.getByText('NT$')).toBeInTheDocument();
    expect(screen.getByText('(TWD)')).toBeInTheDocument();
  });

  it('should display CountUp components with correct values', () => {
    render(
      <RateDisplay
        from="USD"
        to="EUR"
        rate={0.85}
      />
    );
    
    const countUps = screen.getAllByTestId('countup');
    expect(countUps).toHaveLength(2);
    expect(countUps[0]).toHaveTextContent('1.0');
    expect(countUps[1]).toHaveTextContent('0.8500');
  });

  it('should handle null rate correctly', () => {
    render(
      <RateDisplay
        from="USD"
        to="EUR"
        rate={null}
      />
    );
    
    const countUps = screen.getAllByTestId('countup');
    expect(countUps[1]).toHaveTextContent('0.0000');
  });

  it('should display error message when error prop is provided', () => {
    render(
      <RateDisplay
        from="USD"
        to="EUR"
        rate={0.85}
        error="Failed to load rate"
      />
    );
    
    const errorMessage = screen.getByText('Failed to load rate');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');
    
    expect(screen.queryByText('$')).not.toBeInTheDocument();
    expect(screen.queryByText('≈')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <RateDisplay
        from="USD"
        to="TWD"
        rate={32.5}
      />
    );
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('text-xl', 'font-bold');
  });

  it('should display rate in green color', () => {
    render(
      <RateDisplay
        from="USD"
        to="TWD"
        rate={32.5}
      />
    );
    
    const countUps = screen.getAllByTestId('countup');
    const rateCountUp = countUps[1];
    expect(rateCountUp.parentElement).toHaveClass('text-green-600');
  });

  it('should handle different currency symbols correctly', () => {
    render(
      <RateDisplay
        from="EUR"
        to="JPY"
        rate={165.5}
      />
    );
    
    expect(screen.getByText('€')).toBeInTheDocument();
    expect(screen.getByText('(EUR)')).toBeInTheDocument();
    expect(screen.getByText('¥')).toBeInTheDocument();
    expect(screen.getByText('(JPY)')).toBeInTheDocument();
  });

  it('should render flex container with correct classes for rate display', () => {
    render(
      <RateDisplay
        from="USD"
        to="TWD"
        rate={32.5}
      />
    );
    
    const flexContainer = screen.getByText('$').closest('div');
    expect(flexContainer).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should handle zero rate', () => {
    render(
      <RateDisplay
        from="USD"
        to="TWD"
        rate={0}
      />
    );
    
    const countUps = screen.getAllByTestId('countup');
    expect(countUps[1]).toHaveTextContent('0.0000');
  });

  it('should handle very large rates', () => {
    render(
      <RateDisplay
        from="USD"
        to="JPY"
        rate={150.1234}
      />
    );
    
    const countUps = screen.getAllByTestId('countup');
    expect(countUps[1]).toHaveTextContent('150.1234');
  });

  it('should handle very small rates', () => {
    render(
      <RateDisplay
        from="JPY"
        to="USD"
        rate={0.0067}
      />
    );
    
    const countUps = screen.getAllByTestId('countup');
    expect(countUps[1]).toHaveTextContent('0.0067');
  });

  it('should prioritize error display over rate display', () => {
    render(
      <RateDisplay
        from="USD"
        to="TWD"
        rate={32.5}
        error="Network error"
      />
    );
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.queryByTestId('countup')).not.toBeInTheDocument();
  });
});