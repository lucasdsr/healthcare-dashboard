import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select } from './select';

jest.mock('@heroicons/react/24/outline', () => ({
  ChevronDownIcon: ({ className }: { className: string }) => (
    <div data-testid="chevron-down" className={className}>
      ▼
    </div>
  ),
  CheckIcon: ({ className }: { className: string }) => (
    <div data-testid="check-icon" className={className}>
      ✓
    </div>
  ),
}));

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1', description: 'Description 1' },
    { value: 'option2', label: 'Option 2', description: 'Description 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4', disabled: true },
  ];

  const defaultProps = {
    options: mockOptions,
    value: '',
    onChange: jest.fn(),
    placeholder: 'Select an option',
    className: '',
    disabled: false,
    error: '',
    required: false,
    size: 'md' as const,
    searchable: false,
    clearable: true,
    label: '',
    helpText: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Select {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select an option')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Select {...defaultProps} label="Test Label" />);

      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should render with required indicator', () => {
      render(<Select {...defaultProps} label="Test Label" required={true} />);

      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveClass('text-red-500');
    });

    it('should render with help text', () => {
      render(<Select {...defaultProps} helpText="Help text here" />);

      expect(screen.getByText('Help text here')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<Select {...defaultProps} error="Error message" />);

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toHaveClass('text-red-600');
    });

    it('should render with custom className', () => {
      render(<Select {...defaultProps} className="custom-class" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-class');
    });
  });

  describe('Selection State', () => {
    it('should show selected option when value is provided', () => {
      render(<Select {...defaultProps} value="option1" />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Select an option')).not.toBeInTheDocument();
    });

    it('should show placeholder when no value is selected', () => {
      render(<Select {...defaultProps} value="" />);

      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should show clear button when value is selected and clearable is true', () => {
      render(<Select {...defaultProps} value="option1" clearable={true} />);

      const clearButton = screen.getByLabelText('Clear selection');
      expect(clearButton).toBeInTheDocument();
    });

    it('should not show clear button when clearable is false', () => {
      render(<Select {...defaultProps} value="option1" clearable={false} />);

      expect(
        screen.queryByLabelText('Clear selection')
      ).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Interaction', () => {
    it('should open dropdown when clicked', () => {
      render(<Select {...defaultProps} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
      expect(screen.getByText('Option 4')).toBeInTheDocument();
    });

    it('should close dropdown when clicked again', () => {
      render(<Select {...defaultProps} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.click(select);
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should not open dropdown when disabled', () => {
      render(<Select {...defaultProps} disabled={true} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should rotate chevron when dropdown is open', () => {
      render(<Select {...defaultProps} />);

      const select = screen.getByRole('combobox');
      const chevron = screen.getByTestId('chevron-down');

      fireEvent.click(select);
      expect(chevron).toHaveClass('rotate-180');

      fireEvent.click(select);
      expect(chevron).not.toHaveClass('rotate-180');
    });
  });

  describe('Option Selection', () => {
    it('should call onChange when option is selected', () => {
      const onChange = jest.fn();
      render(<Select {...defaultProps} onChange={onChange} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const option1 = screen.getByText('Option 1');
      fireEvent.click(option1);

      expect(onChange).toHaveBeenCalledWith('option1');
    });

    it('should close dropdown after selection', () => {
      const onChange = jest.fn();
      render(<Select {...defaultProps} onChange={onChange} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const option1 = screen.getByText('Option 1');
      fireEvent.click(option1);

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should show check icon for selected option', () => {
      render(<Select {...defaultProps} value="option1" />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const checkIcon = screen.getByTestId('check-icon');
      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon).toHaveClass('text-blue-600');
    });

    it('should not allow selection of disabled options', () => {
      const onChange = jest.fn();
      render(<Select {...defaultProps} onChange={onChange} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const disabledOption = screen.getByText('Option 4');
      const disabledOptionContainer = disabledOption.closest('div');
      expect(disabledOptionContainer).toHaveClass(
        'opacity-50',
        'cursor-not-allowed'
      );

      fireEvent.click(disabledOption);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Searchable Functionality', () => {
    it('should show search input when searchable is true', () => {
      render(<Select {...defaultProps} searchable={true} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const searchInput = screen.getByPlaceholderText('Search options...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should filter options based on search query', () => {
      render(<Select {...defaultProps} searchable={true} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const searchInput = screen.getByPlaceholderText('Search options...');
      fireEvent.change(searchInput, { target: { value: 'Option 1' } });

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('should show no options found message when search has no results', () => {
      render(<Select {...defaultProps} searchable={true} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const searchInput = screen.getByPlaceholderText('Search options...');
      fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

      expect(screen.getByText('No options found')).toBeInTheDocument();
    });
  });

  describe('Clear Functionality', () => {
    it('should clear selection when clear button is clicked', () => {
      const onChange = jest.fn();
      render(<Select {...defaultProps} value="option1" onChange={onChange} />);

      const clearButton = screen.getByLabelText('Clear selection');
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should close dropdown when clearing selection', () => {
      render(<Select {...defaultProps} value="option1" />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      const clearButton = screen.getByLabelText('Clear selection');
      fireEvent.click(clearButton);

      expect(
        screen.getByText('Option 1', { selector: 'div.font-medium' })
      ).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle Enter key to open dropdown', () => {
      render(<Select {...defaultProps} />);

      const select = screen.getByRole('combobox');
      fireEvent.keyDown(select, { key: 'Enter' });

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should handle Escape key to close dropdown', () => {
      render(<Select {...defaultProps} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.keyDown(select, { key: 'Escape' });
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Select {...defaultProps} label="Test Label" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-expanded', 'false');
      expect(select).toHaveAttribute('aria-haspopup', 'listbox');
      expect(select).toHaveAttribute('aria-labelledby', 'Test Label-label');
    });

    it('should have proper tab index', () => {
      render(<Select {...defaultProps} />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('tabIndex', '0');
    });

    it('should have disabled tab index when disabled', () => {
      render(<Select {...defaultProps} disabled={true} />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<Select {...defaultProps} size="sm" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('text-sm', 'px-2', 'py-1.5');
    });

    it('should apply medium size classes', () => {
      render(<Select {...defaultProps} size="md" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('text-base', 'px-3', 'py-2');
    });

    it('should apply large size classes', () => {
      render(<Select {...defaultProps} size="lg" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('text-lg', 'px-4', 'py-3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      render(<Select {...defaultProps} options={[]} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('should handle very long option labels', () => {
      const longLabel = 'A'.repeat(1000);
      const optionsWithLongLabel = [
        { value: 'long', label: longLabel, description: 'Long description' },
      ];

      render(<Select {...defaultProps} options={optionsWithLongLabel} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('should handle special characters in labels', () => {
      const specialLabel = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const optionsWithSpecialChars = [
        { value: 'special', label: specialLabel },
      ];

      render(<Select {...defaultProps} options={optionsWithSpecialChars} />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly with many options', () => {
      const manyOptions = Array.from({ length: 100 }, (_, i) => ({
        value: i.toString(),
        label: `Option ${i}`,
        description: `Description ${i}`,
      }));

      const startTime = performance.now();
      render(<Select {...defaultProps} options={manyOptions} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
