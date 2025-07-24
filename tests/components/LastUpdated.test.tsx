import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LastUpdated from '@/components/LastUpdated';

describe('LastUpdated', () => {
  it('should render with provided time', () => {
    const testTime = '2024-07-24 10:30:00';
    render(<LastUpdated time={testTime} />);

    expect(screen.getByText('最後更新匯率時間： 2024-07-24 10:30:00')).toBeInTheDocument();
  });

  it('should render with default placeholder when time is not provided', () => {
    render(<LastUpdated />);

    expect(screen.getByText('最後更新匯率時間： - -')).toBeInTheDocument();
  });

  it('should render with default placeholder when time is empty string', () => {
    render(<LastUpdated time="" />);

    expect(screen.getByText('最後更新匯率時間： - -')).toBeInTheDocument();
  });

  it('should render with default placeholder when time is undefined', () => {
    render(<LastUpdated time={undefined} />);

    expect(screen.getByText('最後更新匯率時間： - -')).toBeInTheDocument();
  });

  it('should handle different time formats', () => {
    const timeFormats = [
      '2024-07-24 10:30:00',
      '2024/07/24 10:30:00',
      '24/07/2024 10:30',
      'July 24, 2024 10:30 AM'
    ];

    timeFormats.forEach((time, index) => {
      const { unmount } = render(<LastUpdated time={time} />);
      expect(screen.getByText(`最後更新匯率時間： ${time}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<LastUpdated time="2024-07-24 10:30:00" />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('text-center', 'text-gray-700', 'underline');
  });

  it('should render span element with text content', () => {
    render(<LastUpdated time="2024-07-24 10:30:00" />);

    const span = screen.getByText('最後更新匯率時間： 2024-07-24 10:30:00');
    expect(span.tagName).toBe('SPAN');
  });

  it('should render wrapper div with correct structure', () => {
    const { container } = render(<LastUpdated time="2024-07-24 10:30:00" />);

    const div = container.querySelector('div');
    const span = container.querySelector('span');

    expect(div).toBeInTheDocument();
    expect(span).toBeInTheDocument();
    expect(div).toContainElement(span);
  });

  it('should handle very long time strings', () => {
    const longTime = '2024-07-24T10:30:00.123456Z UTC+08:00 (GMT+8)';
    render(<LastUpdated time={longTime} />);

    expect(screen.getByText(`最後更新匯率時間： ${longTime}`)).toBeInTheDocument();
  });

  it('should handle special characters in time string', () => {
    const specialTime = '2024-07-24 10:30:00 (台北時間)';
    render(<LastUpdated time={specialTime} />);

    expect(screen.getByText(`最後更新匯率時間： ${specialTime}`)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<LastUpdated time="2024-07-24 10:30:00" />);

    const element = screen.getByText('最後更新匯率時間： 2024-07-24 10:30:00');
    expect(element).toBeVisible();
  });

  it('should maintain consistent Chinese text', () => {
    render(<LastUpdated time="2024-07-24 10:30:00" />);

    expect(screen.getByText(/最後更新匯率時間/)).toBeInTheDocument();
    expect(screen.getByText(/最後更新匯率時間：/)).toBeInTheDocument();
  });

  it('should handle null value gracefully', () => {
    render(<LastUpdated time={null as any} />);

    expect(screen.getByText('最後更新匯率時間： - -')).toBeInTheDocument();
  });
});