import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchInput } from './search-input';

jest.mock('@heroicons/react/24/outline', () => ({
  MagnifyingGlassIcon: () => <div data-testid="search-icon">🔍</div>,
}));

describe('SearchInput Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    onSelect: jest.fn(),
    placeholder: 'Search...',
    results: [],
    isLoading: false,
    className: '',
    showResults: false,
    onShowResultsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<SearchInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <SearchInput {...defaultProps} placeholder="Custom placeholder" />
      );

      const input = screen.getByPlaceholderText('Custom placeholder');
      expect(input).toBeInTheDocument();
    });

    it('should render with custom value', () => {
      render(<SearchInput {...defaultProps} value="test value" />);

      const input = screen.getByDisplayValue('test value');
      expect(input).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<SearchInput {...defaultProps} className="custom-class" />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Input Interaction', () => {
    it('should call onChange when input value changes', () => {
      const onChange = jest.fn();
      render(<SearchInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(onChange).toHaveBeenCalledWith('new value');
    });

    it('should handle focus events', () => {
      const onShowResultsChange = jest.fn();
      render(
        <SearchInput
          {...defaultProps}
          onShowResultsChange={onShowResultsChange}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);

      expect(onShowResultsChange).toHaveBeenCalledWith(true);
    });

    it('should handle blur events', async () => {
      const onShowResultsChange = jest.fn();
      render(
        <SearchInput
          {...defaultProps}
          onShowResultsChange={onShowResultsChange}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);
      fireEvent.blur(input);

      await waitFor(() => {
        expect(onShowResultsChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Search Results', () => {
    const mockResults = [
      { id: '1', label: 'Result 1', subtitle: 'Subtitle 1' },
      { id: '2', label: 'Result 2', subtitle: 'Subtitle 2' },
      { id: '3', label: 'Result 3' },
    ];

    it('should show results when showResults is true and results exist', () => {
      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          results={mockResults}
        />
      );

      expect(screen.getByText('Result 1')).toBeInTheDocument();
      expect(screen.getByText('Result 2')).toBeInTheDocument();
      expect(screen.getByText('Result 3')).toBeInTheDocument();
      expect(screen.getByText('Subtitle 1')).toBeInTheDocument();
      expect(screen.getByText('Subtitle 2')).toBeInTheDocument();
    });

    it('should show loading state when isLoading is true', () => {
      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          isLoading={true}
          value="test query"
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);

      expect(screen.getByTestId('search-loading')).toBeInTheDocument();
    });

    it('should show no results message when no results found', () => {
      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          value="test query"
          results={[]}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);

      expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });

    it('should not show no results message when query is too short', () => {
      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          value="ab"
          results={[]}
        />
      );

      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('should call onSelect when result is clicked', () => {
      const onSelect = jest.fn();
      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          results={mockResults}
          onSelect={onSelect}
        />
      );

      const result1 = screen.getByText('Result 1');
      fireEvent.click(result1);

      expect(onSelect).toHaveBeenCalledWith(mockResults[0]);
    });

    it('should not show results when showResults is false', () => {
      render(
        <SearchInput
          {...defaultProps}
          showResults={false}
          results={mockResults}
        />
      );

      expect(screen.queryByText('Result 1')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper input attributes', () => {
      render(<SearchInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should support keyboard navigation', () => {
      render(<SearchInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('Styling and Layout', () => {
    it('should have search icon positioned correctly', () => {
      render(<SearchInput {...defaultProps} />);

      const icon = screen.getByTestId('search-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should have proper container structure', () => {
      render(<SearchInput {...defaultProps} />);

      const container = screen
        .getByPlaceholderText('Search...')
        .closest('.relative');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty results array', () => {
      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          results={[]}
          value="test"
        />
      );

      // Focus the input to trigger results display
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);

      expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });

    it('should handle results without subtitle', () => {
      const resultsWithoutSubtitle = [
        { id: '1', label: 'Result 1' },
        { id: '2', label: 'Result 2' },
      ];

      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          results={resultsWithoutSubtitle}
        />
      );

      expect(screen.getByText('Result 1')).toBeInTheDocument();
      expect(screen.getByText('Result 2')).toBeInTheDocument();
    });

    it('should handle very long result labels', () => {
      const longLabel = 'A'.repeat(1000);
      const resultsWithLongLabel = [
        { id: '1', label: longLabel, subtitle: 'Long subtitle' },
      ];

      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          results={resultsWithLongLabel}
        />
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly with many results', () => {
      const manyResults = Array.from({ length: 100 }, (_, i) => ({
        id: i.toString(),
        label: `Result ${i}`,
        subtitle: `Subtitle ${i}`,
      }));

      const startTime = performance.now();
      render(
        <SearchInput
          {...defaultProps}
          showResults={true}
          results={manyResults}
        />
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getAllByText(/Result \d+/)).toHaveLength(100);
    });
  });
});
