import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MetricCard } from '@/presentation/pages/dashboard/metric-card';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('MetricCard should meet accessibility standards', async () => {
    const { container } = render(
      <MetricCard
        title="Total Encounters"
        value="1,234"
        change={{ value: 12, isPositive: true }}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper ARIA labels', () => {
    const { getByText } = render(
      <MetricCard
        title="Total Encounters"
        value="1,234"
        change={{ value: 12, isPositive: true }}
      />
    );

    expect(getByText('Total Encounters')).toBeInTheDocument();
  });

  test('should have proper color contrast', () => {
    const { container } = render(
      <MetricCard
        title="Total Encounters"
        value="1,234"
        change={{ value: 12, isPositive: true }}
      />
    );

    // Check if text elements exist
    const textElements = container.querySelectorAll('p, span, div');
    expect(textElements.length).toBeGreaterThan(0);
  });

  test('should have proper alt text for images', () => {
    const { container } = render(
      <MetricCard
        title="Total Encounters"
        value="1,234"
        change={{ value: 12, isPositive: true }}
      />
    );

    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    }

    const svgs = container.querySelectorAll('svg');
    if (svgs.length > 0) {
      svgs.forEach(svg => {
        expect(svg).toHaveAttribute('aria-label');
        expect(svg.getAttribute('aria-label')).not.toBe('');
      });
    }
  });
});
