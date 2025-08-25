import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner Component', () => {
  const defaultProps = {
    size: 'md' as const,
    className: '',
    text: '',
    variant: 'purple' as const,
  };

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<LoadingSpinner {...defaultProps} className="custom-class" />);

      const container = screen.getByTestId('loading-spinner');
      expect(container).toHaveClass('custom-class');
    });

    it('should render with text when provided', () => {
      render(<LoadingSpinner {...defaultProps} text="Loading..." />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not render text when not provided', () => {
      render(<LoadingSpinner {...defaultProps} />);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<LoadingSpinner {...defaultProps} size="sm" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('w-4', 'h-4');
    });

    it('should apply medium size classes', () => {
      render(<LoadingSpinner {...defaultProps} size="md" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('w-8', 'h-8');
    });

    it('should apply large size classes', () => {
      render(<LoadingSpinner {...defaultProps} size="lg" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('h-12', 'w-12');
    });

    it('should apply extra large size classes', () => {
      render(<LoadingSpinner {...defaultProps} size="lg" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('h-12', 'w-12');
    });
  });

  describe('Variants', () => {
    it('should apply purple variant classes', () => {
      render(<LoadingSpinner {...defaultProps} variant="purple" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('border-purple-600');
    });

    it('should apply blue variant classes', () => {
      render(<LoadingSpinner {...defaultProps} variant="blue" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('border-blue-600');
    });

    it('should apply green variant classes', () => {
      render(<LoadingSpinner {...defaultProps} variant="green" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('border-green-600');
    });

    it('should apply red variant classes', () => {
      render(<LoadingSpinner {...defaultProps} variant="purple" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('border-purple-600');
    });

    it('should apply gray variant classes', () => {
      render(<LoadingSpinner {...defaultProps} variant="purple" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('border-purple-600');
    });
  });

  describe('Spinner Element', () => {
    it('should have proper spinner structure', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');

      expect(spinnerElement).toHaveClass(
        'animate-spin',
        'rounded-full',
        'border-b-2'
      );
    });

    it('should have animation classes', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('animate-spin');
    });

    it('should have border radius', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('rounded-full');
    });

    it('should have border width', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');
      expect(spinnerElement).toHaveClass('border-b-2');
    });
  });

  describe('Text Styling', () => {
    it('should apply proper text classes when text is provided', () => {
      render(<LoadingSpinner {...defaultProps} text="Loading..." />);

      const textElement = screen.getByText('Loading...');
      expect(textElement).toHaveClass('text-sm', 'text-center', 'mt-2');
    });

    it('should not render text element when no text', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const container = screen.getByTestId('loading-spinner');
      const textElement = container.querySelector('p');
      expect(textElement).not.toBeInTheDocument();
    });
  });

  describe('Container Styling', () => {
    it('should have proper container classes', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const container = screen.getByTestId('loading-spinner');
      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      );
    });

    it('should combine custom className with default classes', () => {
      render(<LoadingSpinner {...defaultProps} className="custom-class" />);

      const container = screen.getByTestId('loading-spinner');
      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'custom-class'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner.tagName).toBe('DIV');
    });

    it('should not have text content when no text provided', () => {
      render(<LoadingSpinner {...defaultProps} />);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveTextContent('');
    });
  });

  describe('Combinations', () => {
    it('should combine size and variant correctly', () => {
      render(<LoadingSpinner {...defaultProps} size="lg" variant="blue" />);

      const spinner = screen.getByTestId('loading-spinner');
      const spinnerElement = spinner.querySelector('div');

      expect(spinnerElement).toHaveClass('h-12', 'w-12', 'border-blue-600');
    });

    it('should combine all props correctly', () => {
      render(
        <LoadingSpinner
          {...defaultProps}
          size="lg"
          variant="green"
          className="custom-class"
          text="Custom loading text"
        />
      );

      const container = screen.getByTestId('loading-spinner');
      const spinnerElement = container.querySelector('div');
      const textElement = screen.getByText('Custom loading text');

      expect(container).toHaveClass('custom-class');
      expect(spinnerElement).toHaveClass('w-12', 'h-12', 'border-green-600');
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty className', () => {
      render(<LoadingSpinner {...defaultProps} className="" />);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should handle empty text', () => {
      render(<LoadingSpinner {...defaultProps} text="" />);

      const container = screen.getByTestId('loading-spinner');
      const textElement = container.querySelector('p');
      expect(textElement).not.toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000);
      render(<LoadingSpinner {...defaultProps} text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<LoadingSpinner {...defaultProps} text={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('should handle unicode characters in text', () => {
      const unicodeText = 'Unicode: 🚀🌟🎉中文日本語한국어';
      render(<LoadingSpinner {...defaultProps} text={unicodeText} />);

      expect(screen.getByText(unicodeText)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<LoadingSpinner {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle multiple spinners efficiently', () => {
      const startTime = performance.now();
      render(
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <LoadingSpinner key={i} {...defaultProps} text={`Spinner ${i}`} />
          ))}
        </div>
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getAllByText(/Spinner \d+/)).toHaveLength(10);
    });
  });
});
