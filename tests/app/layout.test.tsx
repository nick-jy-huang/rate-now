import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout, { generateMetadata } from '@/app/layout';

vi.mock('next/font/google', () => ({
  Geist: vi.fn(() => ({
    variable: '--font-geist-sans',
    className: 'geist-sans'
  })),
  Geist_Mono: vi.fn(() => ({
    variable: '--font-geist-mono',
    className: 'geist-mono'
  }))
}));

vi.mock('@/styles/globals.css', () => ({}));

describe('RootLayout', () => {
  it('should render children correctly', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    const { getByTestId } = render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    expect(getByTestId('test-child')).toBeInTheDocument();
    expect(getByTestId('test-child')).toHaveTextContent('Test Content');
  });

  it('should render multiple children correctly', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </RootLayout>
    );

    expect(getByTestId('child-1')).toBeInTheDocument();
    expect(getByTestId('child-2')).toBeInTheDocument();
  });

  it('should render layout structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    );

    expect(container).toBeInTheDocument();
  });
});

describe('generateMetadata', () => {
  it('should return correct metadata object', () => {
    const metadata = generateMetadata();

    expect(metadata).toEqual({
      title: 'Rate Now',
      description: '即時貨幣匯率查詢與轉換工具。Rate Now 幫你快速換算全球幣值，支援多國貨幣，自動更新匯率，換算無煩惱。',
      openGraph: {
        type: 'website',
        title: 'Rate Now',
        description: '即時貨幣匯率查詢與轉換工具。Rate Now 幫你快速換算全球幣值，支援多國貨幣，自動更新匯率，換算無煩惱。',
        url: 'https://rate-now.vercel.app/',
        images: [
          {
            url: 'https://rate-now.vercel.app/0.png',
            width: 1200,
            height: 630,
          },
        ],
      },
      icons: {
        icon: 'https://rate-now.vercel.ap/icon/favicon.ico',
      },
    });
  });

  it('should have consistent title and description', () => {
    const metadata = generateMetadata();

    expect(metadata.title).toBe('Rate Now');
    expect(metadata.description).toBe(metadata.openGraph.description);
    expect(metadata.openGraph.title).toBe(metadata.title);
  });

  it('should have correct OpenGraph configuration', () => {
    const metadata = generateMetadata();

    expect(metadata.openGraph.type).toBe('website');
    expect(metadata.openGraph.url).toBe('https://rate-now.vercel.app/');
    expect(metadata.openGraph.images).toHaveLength(1);
    expect(metadata.openGraph.images[0]).toEqual({
      url: 'https://rate-now.vercel.app/0.png',
      width: 1200,
      height: 630,
    });
  });

  it('should have correct favicon configuration', () => {
    const metadata = generateMetadata();

    expect(metadata.icons.icon).toBe('https://rate-now.vercel.ap/icon/favicon.ico');
  });

  it('should use Chinese description for localization', () => {
    const metadata = generateMetadata();
    
    expect(metadata.description).toMatch(/即時貨幣匯率查詢與轉換工具/);
    expect(metadata.description).toMatch(/支援多國貨幣/);
  });
});