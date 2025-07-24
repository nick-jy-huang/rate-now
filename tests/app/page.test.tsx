import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

vi.mock('@/components/CurrencySelect', () => ({
  default: ({ value, onChange, options, disabled, getOptionLabel }: any) => (
    <select 
      value={value} 
      onChange={onChange} 
      disabled={disabled}
      data-testid={`currency-select-${value}`}
    >
      {options.map((option: string) => (
        <option key={option} value={option}>
          {getOptionLabel ? getOptionLabel(option) : option}
        </option>
      ))}
    </select>
  )
}));

vi.mock('@/components/AmountInput', () => ({
  default: ({ value, onChange, disabled }: any) => (
    <input
      type="number"
      value={value}
      onChange={onChange}
      disabled={disabled}
      data-testid={`amount-input-${value}`}
    />
  )
}));

vi.mock('@/components/RateDisplay', () => ({
  default: ({ from, to, rate, error }: any) => (
    <div data-testid="rate-display">
      {error ? (
        <span data-testid="rate-error">{error}</span>
      ) : (
        <span data-testid="rate-value">{`${from} to ${to}: ${rate || 'N/A'}`}</span>
      )}
    </div>
  )
}));

vi.mock('@/components/SwapButton', () => ({
  default: ({ onClick, disabled }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid="swap-button"
    >
      Swap
    </button>
  )
}));

vi.mock('@/components/UpdateButton', () => ({
  default: ({ onClick, loading }: any) => (
    <button 
      onClick={onClick} 
      disabled={loading}
      data-testid="update-button"
    >
      {loading ? 'Updating...' : 'Update'}
    </button>
  )
}));

vi.mock('@/components/Ribbon', () => ({
  default: ({ href, children }: any) => (
    <a href={href} data-testid="ribbon">{children}</a>
  )
}));

vi.mock('@/components/LastUpdated', () => ({
  default: ({ time }: any) => (
    <span data-testid="last-updated">{time || 'Never updated'}</span>
  )
}));

vi.mock('@/utils/dateUtils', () => ({
  default: vi.fn((date) => ({
    format: vi.fn((format) => {
      if (date) return '2024-07-24 10:30:00';
      return '2024-07-24 10:30:00';
    })
  }))
}));

vi.mock('@/constants', () => ({
  CURRENCY_NAME_MAP: {
    USD: '美元',
    TWD: '新台幣',
    EUR: '歐元',
    JPY: '日圓'
  }
}));

global.fetch = vi.fn();

describe('Home Page', () => {
  const mockSuccessResponse = {
    rate: 32.5,
    updatedAt: '2024-07-24T10:30:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSuccessResponse)
    } as Response);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render all main components', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('ribbon')).toBeInTheDocument();
      expect(screen.getByAltText('logo')).toBeInTheDocument();
      expect(screen.getByText('Rate Now')).toBeInTheDocument();
      expect(screen.getByTestId('rate-display')).toBeInTheDocument();
      expect(screen.getByTestId('currency-select-USD')).toBeInTheDocument();
      expect(screen.getByTestId('currency-select-TWD')).toBeInTheDocument();
      expect(screen.getByTestId('swap-button')).toBeInTheDocument();
      expect(screen.getByTestId('update-button')).toBeInTheDocument();
      expect(screen.getByTestId('last-updated')).toBeInTheDocument();
    });
  });

  it('should fetch initial rate on mount', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rates?from=USD&to=TWD');
    });
  });

  it('should display fetched rate correctly', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-value')).toHaveTextContent('USD to TWD: 32.5');
    });
  });

  it('should update last updated time after successful fetch', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('last-updated')).toHaveTextContent('2024-07-24 10:30:00');
    });
  });

  it('should handle from currency change', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const fromSelect = screen.getByTestId('currency-select-USD');
    await user.selectOptions(fromSelect, 'EUR');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rates?from=EUR&to=TWD');
    });
  });

  it('should handle to currency change', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const toSelect = screen.getByTestId('currency-select-TWD');
    await user.selectOptions(toSelect, 'JPY');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rates?from=USD&to=JPY');
    });
  });

  it('should handle swap button click', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rates?from=USD&to=TWD');
    });

    const swapButton = screen.getByTestId('swap-button');
    await user.click(swapButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rates?from=TWD&to=USD');
    });
  });

  it('should handle manual update button click', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rates?from=USD&to=TWD');
    });

    const updateButton = screen.getByTestId('update-button');
    await user.click(updateButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rates', { method: 'POST' });
    });
  });

  it('should calculate to amount when from amount changes', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-value')).toHaveTextContent('USD to TWD: 32.5');
    });

    const fromInput = screen.getByTestId('amount-input-1');
    await user.clear(fromInput);
    await user.type(fromInput, '100');

    await waitFor(() => {
      expect(screen.getByTestId('amount-input-3250')).toBeInTheDocument();
    });
  });

  it('should calculate from amount when to amount changes', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-value')).toHaveTextContent('USD to TWD: 32.5');
    });

    const toInput = screen.getByTestId('amount-input-32.5');
    await user.clear(toInput);
    await user.type(toInput, '650');

    await waitFor(() => {
      expect(screen.getByTestId('amount-input-20')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-error')).toHaveTextContent('API connected failed');
    });
  });

  it('should handle currency not found error', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ error: 'Currency not found' })
    } as Response);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-error')).toHaveTextContent('Currency not found');
    });
  });

  it('should show loading state during manual update', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-value')).toBeInTheDocument();
    });

    vi.mocked(fetch).mockImplementation((url, options) => {
      if (options?.method === 'POST') {
        return new Promise(resolve => {
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({})
          } as Response), 50);
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      } as Response);
    });

    const updateButton = screen.getByTestId('update-button');
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByTestId('currency-select-USD')).toBeDisabled();
      expect(screen.getByTestId('currency-select-TWD')).toBeDisabled();
      expect(screen.getByTestId('swap-button')).toBeDisabled();
    });
  });

  it('should clear error when making new requests', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-error')).toHaveTextContent('API connected failed');
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSuccessResponse)
    } as Response);

    const user = userEvent.setup();
    const fromSelect = screen.getByTestId('currency-select-USD');
    await user.selectOptions(fromSelect, 'EUR');

    await waitFor(() => {
      expect(screen.getByTestId('rate-value')).toBeInTheDocument();
      expect(screen.queryByTestId('rate-error')).not.toBeInTheDocument();
    });
  });

  it('should handle zero rate as currency not found', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ rate: 0, updatedAt: '2024-07-24T10:30:00Z' })
    } as Response);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-error')).toHaveTextContent('Currency not found');
    });

    expect(screen.getByTestId('amount-input-1')).toBeInTheDocument();
    expect(screen.getByTestId('amount-input-0')).toBeInTheDocument();
  });

  it('should render logo with correct attributes', async () => {
    render(<Home />);

    await waitFor(() => {
      const logo = screen.getByAltText('logo');
      expect(logo).toHaveAttribute('src', '/icon-192.png');
      expect(logo).toHaveClass('h-24', 'w-24', 'duration-200', 'hover:scale-120', 'hover:rotate-180');
    });
  });

  it('should render ribbon with correct link', async () => {
    render(<Home />);

    await waitFor(() => {
      const ribbon = screen.getByTestId('ribbon');
      expect(ribbon).toHaveAttribute('href', 'https://tw.rter.info');
      expect(ribbon).toHaveTextContent('資料來源');
    });
  });

  it('should have correct CSS classes for main container', async () => {
    const { container } = render(<Home />);

    await waitFor(() => {
      const main = container.querySelector('main');
      expect(main).toHaveClass(
        'font-san',
        'flex',
        'h-screen',
        'items-start',
        'justify-center',
        'p-4',
        'sm:items-center'
      );
    });
  });
});