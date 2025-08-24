import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  QueryStateHandler,
  QueryStateHandlerWithHeader,
} from '../query-state-handler';

describe('QueryStateHandler', () => {
  it('renders children when no loading or error', () => {
    render(
      <QueryStateHandler>
        <div>Content</div>
      </QueryStateHandler>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders loading state when isLoading is true', () => {
    render(
      <QueryStateHandler isLoading={true}>
        <div>Content</div>
      </QueryStateHandler>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    const error = new Error('Test error');
    render(
      <QueryStateHandler error={error} errorMessage={error.message}>
        <div>Content</div>
      </QueryStateHandler>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders without card when showCard is false', () => {
    render(
      <QueryStateHandler isLoading={true} showCard={false}>
        <div>Content</div>
      </QueryStateHandler>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('renders with custom loading text', () => {
    render(
      <QueryStateHandler isLoading={true} loadingText="Custom loading...">
        <div>Content</div>
      </QueryStateHandler>
    );
    expect(screen.getByText('Custom loading...')).toBeInTheDocument();
  });

  it('renders with custom error title and subtitle', () => {
    const error = new Error('Test error');
    render(
      <QueryStateHandler
        error={error}
        errorTitle="Custom Error"
        errorSubtitle="Custom subtitle"
      >
        <div>Content</div>
      </QueryStateHandler>
    );
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('Custom subtitle')).toBeInTheDocument();
  });
});

describe('QueryStateHandlerWithHeader', () => {
  it('renders children when no loading or error', () => {
    render(
      <QueryStateHandlerWithHeader title="Test Title" subtitle="Test Subtitle">
        <div>Content</div>
      </QueryStateHandlerWithHeader>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders loading state with header when isLoading is true', () => {
    render(
      <QueryStateHandlerWithHeader
        title="Test Title"
        subtitle="Test Subtitle"
        isLoading={true}
      >
        <div>Content</div>
      </QueryStateHandlerWithHeader>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders error state with header when error is provided', () => {
    const error = new Error('Test error');
    render(
      <QueryStateHandlerWithHeader
        title="Test Title"
        subtitle="Test Subtitle"
        error={error}
        errorMessage={error.message}
      >
        <div>Content</div>
      </QueryStateHandlerWithHeader>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders without subtitle when not provided', () => {
    render(
      <QueryStateHandlerWithHeader title="Test Title">
        <div>Content</div>
      </QueryStateHandlerWithHeader>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });
});
