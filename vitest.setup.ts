import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock Next.js navigation
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    useSearchParams: () => ({
      get: vi.fn().mockImplementation((key: string) => null),
    }),
    usePathname: () => '/',
    useParams: () => ({ id: 'prod-elec-01' }),
  };
});

// Mock Next.js Image component
vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: ({ fill, priority, ...props }: any) => {
      return React.createElement('img', {
        ...props,
        alt: props.alt || '',
      });
    },
  };
});
