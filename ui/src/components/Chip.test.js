/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from './Chip';

describe('Chip Component', () => {
  it('renders with children text', () => {
    render(<Chip>Test Chip</Chip>);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('renders with content prop', () => {
    render(<Chip content="Content Prop" />);
    expect(screen.getByText('Content Prop')).toBeInTheDocument();
  });

  it('prioritizes content prop over children', () => {
    render(<Chip content="Content">Children</Chip>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Children')).not.toBeInTheDocument();
  });

  it('applies base chip class', () => {
    const { container } = render(<Chip>Base Chip</Chip>);
    const chipElement = container.querySelector('.chip');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies success class when success prop is true', () => {
    const { container } = render(<Chip success>Success Chip</Chip>);
    const chipElement = container.querySelector('.chip.success');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies omit class when omit prop is true', () => {
    const { container } = render(<Chip omit>Omit Chip</Chip>);
    const chipElement = container.querySelector('.chip.omit');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies progress class when progress prop is true', () => {
    const { container } = render(<Chip progress>Progress Chip</Chip>);
    const chipElement = container.querySelector('.chip.progress');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies feel class when feel prop is true', () => {
    const { container } = render(<Chip feel>Feel Chip</Chip>);
    const chipElement = container.querySelector('.chip.feel');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies feel-grey class when feelGrey prop is true', () => {
    const { container } = render(<Chip feelGrey>Feel Grey Chip</Chip>);
    const chipElement = container.querySelector('.chip.feel-grey');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Chip className="custom-class">Custom</Chip>);
    const chipElement = container.querySelector('.chip.custom-class');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies inline styles', () => {
    const customStyle = { backgroundColor: 'red', padding: '10px' };
    const { container } = render(<Chip style={customStyle}>Styled Chip</Chip>);
    const chipElement = container.querySelector('.chip');
    expect(chipElement).toHaveStyle('background-color: red');
    expect(chipElement).toHaveStyle('padding: 10px');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Chip onClick={handleClick}>Clickable Chip</Chip>);

    const chipElement = screen.getByText('Clickable Chip');
    fireEvent.click(chipElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick if no handler provided', () => {
    // Should not throw error
    render(<Chip>Non-Clickable Chip</Chip>);
    const chipElement = screen.getByText('Non-Clickable Chip');

    expect(() => {
      fireEvent.click(chipElement);
    }).not.toThrow();
  });

  it('only applies the first matching status class', () => {
    // success should take precedence
    const { container } = render(
      <Chip success omit progress>Multiple States</Chip>
    );
    const chipElement = container.querySelector('.chip');

    expect(chipElement).toHaveClass('success');
    expect(chipElement).not.toHaveClass('omit');
    expect(chipElement).not.toHaveClass('progress');
  });
});
