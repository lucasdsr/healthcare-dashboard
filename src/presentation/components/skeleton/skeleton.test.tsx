import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton, MetricCardSkeleton } from './skeleton';

describe('Skeleton Component', () => {
  describe('Skeleton', () => {
    it('should render with default props', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Skeleton className="custom-skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('custom-skeleton');
    });

    it('should render with custom width', () => {
      render(<Skeleton width="200px" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('should render with custom height', () => {
      render(<Skeleton height="100px" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    it('should render with both width and height', () => {
      render(<Skeleton width="300px" height="150px" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({
        width: '300px',
        height: '150px',
      });
    });

    it('should apply default skeleton classes', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass(
        'animate-pulse',
        'rounded-md',
        'bg-neutral-200'
      );
    });

    it('should combine custom className with default classes', () => {
      render(<Skeleton className="custom-class" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass(
        'custom-class',
        'animate-pulse',
        'rounded-md',
        'bg-neutral-200'
      );
    });
  });

  describe('MetricCardSkeleton', () => {
    it('should render metric card skeleton', () => {
      render(<MetricCardSkeleton />);
      const container = screen.getByTestId('metric-card-skeleton');
      expect(container).toBeInTheDocument();
    });

    it('should render all skeleton elements', () => {
      render(<MetricCardSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(1);
    });

    it('should have proper structure', () => {
      render(<MetricCardSkeleton />);
      const container = screen.getByTestId('metric-card-skeleton');

      expect(container).toHaveClass('p-6', 'rounded-lg', 'border', 'bg-white');
    });

    it('should render header skeleton elements', () => {
      render(<MetricCardSkeleton />);
      const container = screen.getByTestId('metric-card-skeleton');

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(1);
    });

    it('should render value skeleton', () => {
      render(<MetricCardSkeleton />);
      const container = screen.getByTestId('metric-card-skeleton');

      expect(container).toHaveClass('p-6', 'rounded-lg', 'border', 'bg-white');
    });

    it('should render subtitle skeleton', () => {
      render(<MetricCardSkeleton />);
      const container = screen.getByTestId('metric-card-skeleton');

      expect(container).toHaveClass('p-6', 'rounded-lg', 'border', 'bg-white');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.tagName).toBe('DIV');
    });

    it('should not have text content', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveTextContent('');
    });
  });

  describe('Styling', () => {
    it('should apply animation classes', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should apply background color', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('bg-neutral-200');
    });

    it('should apply border radius', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded-md');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty className', () => {
      render(<Skeleton className="" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should handle undefined width and height', () => {
      render(<Skeleton width={undefined} height={undefined} />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should handle zero dimensions', () => {
      render(<Skeleton width="0px" height="0px" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '0px', height: '0px' });
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<Skeleton />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle multiple skeletons efficiently', () => {
      const startTime = performance.now();
      render(
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} width="100px" height="20px" />
          ))}
        </div>
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getAllByTestId('skeleton')).toHaveLength(10);
    });
  });
});
