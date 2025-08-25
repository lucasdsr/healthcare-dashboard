import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  const defaultProps = {
    children: 'Test Badge',
    variant: 'default' as const,
  };

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Badge {...defaultProps} />);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Badge {...defaultProps} className="custom-class" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('custom-class');
    });

    it('should render with custom variant', () => {
      render(<Badge {...defaultProps} variant="success" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should render with custom size', () => {
      render(<Badge {...defaultProps} size="lg" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      render(<Badge {...defaultProps} variant="default" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
    });

    it('should apply success variant styles', () => {
      render(<Badge {...defaultProps} variant="success" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should apply warning variant styles', () => {
      render(<Badge {...defaultProps} variant="warning" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should apply destructive variant styles', () => {
      render(<Badge {...defaultProps} variant="destructive" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('should apply info variant styles', () => {
      render(<Badge {...defaultProps} variant="info" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      render(<Badge {...defaultProps} size="sm" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
    });

    it('should apply default size styles', () => {
      render(<Badge {...defaultProps} size="default" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-xs');
    });

    it('should apply large size styles', () => {
      render(<Badge {...defaultProps} size="lg" />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
    });
  });

  describe('Content', () => {
    it('should render text content', () => {
      render(<Badge {...defaultProps}>Simple Text</Badge>);
      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });

    it('should render complex content', () => {
      render(
        <Badge {...defaultProps}>
          <span>Complex</span> <strong>Content</strong>
        </Badge>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render numeric content', () => {
      render(<Badge {...defaultProps}>42</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<Badge {...defaultProps}>{''}</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
    });

    it('should handle null children', () => {
      render(<Badge {...defaultProps}>{null}</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(<Badge {...defaultProps}>{undefined}</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<Badge {...defaultProps} />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe('DIV');
    });

    it('should support aria-label', () => {
      render(<Badge {...defaultProps} aria-label="Status indicator" />);
      const badge = screen.getByLabelText('Status indicator');
      expect(badge).toBeInTheDocument();
    });

    it('should support role attribute', () => {
      render(<Badge {...defaultProps} role="status" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text', () => {
      const longText =
        'This is a very long text that should be handled gracefully by the badge component';
      render(<Badge {...defaultProps}>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters', () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<Badge {...defaultProps}>{specialText}</Badge>);
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('should handle unicode characters', () => {
      const unicodeText = 'Unicode: 🚀🌟🎉中文日本語한국어';
      render(<Badge {...defaultProps}>{unicodeText}</Badge>);
      expect(screen.getByText(unicodeText)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly with large content', () => {
      const largeContent = 'A'.repeat(1000);
      const startTime = performance.now();

      render(<Badge {...defaultProps}>{largeContent}</Badge>);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
      expect(screen.getByText(largeContent)).toBeInTheDocument();
    });
  });

  describe('Combinations', () => {
    it('should combine all props correctly', () => {
      render(
        <Badge variant="destructive" size="sm" className="custom-class">
          Destructive Small
        </Badge>
      );
      const badge = screen.getByText('Destructive Small');
      expect(badge).toHaveClass(
        'bg-red-100',
        'text-red-800',
        'px-2',
        'py-0.5',
        'text-xs',
        'custom-class'
      );
    });

    it('should handle multiple variants', () => {
      const { rerender } = render(
        <Badge {...defaultProps} variant="default" />
      );

      rerender(<Badge {...defaultProps} variant="success" />);
      expect(screen.getByText('Test Badge')).toHaveClass(
        'bg-green-100',
        'text-green-800'
      );

      rerender(<Badge {...defaultProps} variant="warning" />);
      expect(screen.getByText('Test Badge')).toHaveClass(
        'bg-yellow-100',
        'text-yellow-800'
      );
    });
  });
});
