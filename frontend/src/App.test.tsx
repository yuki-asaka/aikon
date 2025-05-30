import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app component', () => {
  render(<App />);
  expect(screen.getByText(/AIイラスト生成/i)).toBeInTheDocument();
});
