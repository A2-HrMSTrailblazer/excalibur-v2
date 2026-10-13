import '@testing-library/jest-dom/vitest';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom has no <canvas>; replace the chart components with simple placeholders.
vi.mock('react-chartjs-2', () => ({
  Line: (props) => createElement('div', { 'data-testid': 'line-chart', 'data-points': props.data.datasets[0].data.length }),
  Bar: (props) => createElement('div', { 'data-testid': 'bar-chart', 'data-points': props.data.datasets[0].data.length }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
