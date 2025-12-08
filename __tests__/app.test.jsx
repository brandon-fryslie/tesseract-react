import React from 'react';
import { render } from '@testing-library/react';

// Simple smoke test to verify React Testing Library works
// Full integration tests will be added later in the modernization process

describe('React Testing Library', () => {
  it('can render a simple component', () => {
    const TestComponent = () => <div data-testid="test">Hello World</div>;
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test')).toBeInTheDocument();
    expect(getByTestId('test')).toHaveTextContent('Hello World');
  });

  it('works with toBeInTheDocument matcher', () => {
    const TestComponent = () => <span>Testing RTL</span>;
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
