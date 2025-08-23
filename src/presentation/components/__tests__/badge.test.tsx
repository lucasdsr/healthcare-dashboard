import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary-100');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-green-100');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('bg-yellow-100');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-red-100');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('px-2.5 py-0.5 text-xs');

    rerender(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('px-2 py-0.5 text-xs');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('px-3 py-1 text-sm');
  });

  it('renders removable badge when removable prop is true', () => {
    render(<Badge removable>Removable</Badge>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = jest.fn();
    render(
      <Badge removable onRemove={handleRemove}>
        Removable
      </Badge>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('does not render remove button when removable is false', () => {
    render(<Badge>Not Removable</Badge>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });
});
