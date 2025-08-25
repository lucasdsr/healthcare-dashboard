import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from './date-input';

jest.mock('@heroicons/react/24/outline', () => ({
  XMarkIcon: () => <span data-testid="x-mark-icon">X</span>,
}));

describe('DateInput', () => {
  const defaultProps = {
    label: 'Select Date',
    value: undefined as Date | undefined,
    onChange: jest.fn(),
    placeholder: 'Choose a date',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<DateInput {...defaultProps} />);
      expect(screen.getByText('Select Date')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Choose a date')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<DateInput {...defaultProps} className="custom-class" />);
      const input = screen.getByPlaceholderText('Choose a date');
      expect(input).toHaveClass('custom-class');
    });

    it('should render with label', () => {
      render(<DateInput {...defaultProps} label="Custom Label" />);
      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<DateInput {...defaultProps} placeholder="Custom placeholder" />);
      expect(
        screen.getByPlaceholderText('Custom placeholder')
      ).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('should call onChange when input value changes', () => {
      const onChange = jest.fn();
      render(<DateInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Choose a date');
      fireEvent.change(input, { target: { value: '2024-01-01' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('should handle empty input', () => {
      const onChange = jest.fn();
      render(<DateInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Choose a date');
      fireEvent.change(input, { target: { value: '' } });

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Props Handling', () => {
    it('should handle disabled state', () => {
      render(<DateInput {...defaultProps} disabled />);
      const input = screen.getByPlaceholderText('Choose a date');
      expect(input).toBeDisabled();
    });

    it('should handle required state', () => {
      render(<DateInput {...defaultProps} required />);
      const input = screen.getByPlaceholderText('Choose a date');
      expect(input).toBeRequired();
    });

    it('should handle min and max date constraints', () => {
      render(<DateInput {...defaultProps} min="2024-01-01" max="2024-12-31" />);
      const input = screen.getByPlaceholderText('Choose a date');
      expect(input).toHaveAttribute('min', '2024-01-01');
      expect(input).toHaveAttribute('max', '2024-12-31');
    });
  });

  describe('Styling', () => {
    it('should apply default styles', () => {
      render(<DateInput {...defaultProps} />);
      const input = screen.getByPlaceholderText('Choose a date');
      expect(input).toHaveClass('w-full', 'border', 'rounded-lg');
    });

    it('should apply custom styles', () => {
      render(<DateInput {...defaultProps} className="custom-styles" />);
      const input = screen.getByPlaceholderText('Choose a date');
      expect(input).toHaveClass('custom-styles');
    });
  });

  describe('Error Handling', () => {
    it('should display error message', () => {
      render(
        <DateInput {...defaultProps} error="Please select a valid date" />
      );
      expect(
        screen.getByText('Please select a valid date')
      ).toBeInTheDocument();
    });

    it('should not display error message when no error', () => {
      render(<DateInput {...defaultProps} />);
      expect(
        screen.queryByText('Please select a valid date')
      ).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      render(<DateInput {...defaultProps} />);
      const input = screen.getByPlaceholderText('Choose a date');
      const label = screen.getByText('Select Date');

      expect(input).toHaveAttribute('type', 'date');
      expect(label).toBeInTheDocument();
    });
  });
});
