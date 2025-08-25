import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with default props', () => {
      render(<Card>Card content</Card>);

      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        'rounded-lg',
        'border',
        'border-gray-200',
        'bg-white',
        'text-card-foreground',
        'shadow-md'
      );
    });

    it('should render card with custom className', () => {
      render(<Card className="custom-card">Custom Card</Card>);

      const card = screen.getByText('Custom Card');
      expect(card).toHaveClass('custom-card');
    });

    it('should forward ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Ref Card</Card>);

      expect(ref.current).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('should render card header with default props', () => {
      render(<CardHeader>Header content</CardHeader>);

      const header = screen.getByText('Header content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('should render card header with custom className', () => {
      render(<CardHeader className="custom-header">Custom Header</CardHeader>);

      const header = screen.getByText('Custom Header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('should render card title with default props', () => {
      render(<CardTitle>Card Title</CardTitle>);

      const title = screen.getByRole('heading', { name: 'Card Title' });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        'text-2xl',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should render card title with custom className', () => {
      render(<CardTitle className="custom-title">Custom Title</CardTitle>);

      const title = screen.getByRole('heading', { name: 'Custom Title' });
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('should render card description with default props', () => {
      render(<CardDescription>Card description</CardDescription>);

      const description = screen.getByText('Card description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should render card description with custom className', () => {
      render(
        <CardDescription className="custom-description">
          Custom Description
        </CardDescription>
      );

      const description = screen.getByText('Custom Description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('CardContent', () => {
    it('should render card content with default props', () => {
      render(<CardContent>Content text</CardContent>);

      const content = screen.getByText('Content text');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('should render card content with custom className', () => {
      render(
        <CardContent className="custom-content">Custom Content</CardContent>
      );

      const content = screen.getByText('Custom Content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('should render card footer with default props', () => {
      render(<CardFooter>Footer content</CardFooter>);

      const footer = screen.getByText('Footer content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('should render card footer with custom className', () => {
      render(<CardFooter className="custom-footer">Custom Footer</CardFooter>);

      const footer = screen.getByText('Custom Footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Card Composition', () => {
    it('should render complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(
        screen.getByRole('heading', { name: 'Test Title' })
      ).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });
  });
});
