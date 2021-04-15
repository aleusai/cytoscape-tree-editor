import React from 'react';
import { render } from '@testing-library/react';
 
import RenderApp from './index.js';
 
describe('RenderApp', () => {
  test('renders App component', () => {
    render(<RenderApp />);

  });
});