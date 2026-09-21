import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('shows the support inbox UI', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /inbox/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by subject/i)).toBeInTheDocument();
  });
});

