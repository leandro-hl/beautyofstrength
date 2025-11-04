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
import { InputNumber } from './InputNumber';

describe('InputNumber Component', () => {
  it('renders with default placeholder', () => {
    render(<InputNumber onChange={() => {}} />);
    const input = screen.getByPlaceholderText('4');
    expect(input).toBeInTheDocument();
  });

  it('renders with seconds placeholder when seconds prop is true', () => {
    render(<InputNumber seconds onChange={() => {}} />);
    const input = screen.getByPlaceholderText('30"');
    expect(input).toBeInTheDocument();
  });

  it('renders with minutes placeholder when minutes prop is true', () => {
    render(<InputNumber minutes onChange={() => {}} />);
    const input = screen.getByPlaceholderText("15'");
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<InputNumber placeHolder="Custom" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Custom');
    expect(input).toBeInTheDocument();
  });

  it('renders with label when provided', () => {
    render(<InputNumber label="Repetitions" onChange={() => {}} />);
    expect(screen.getByText('Repetitions')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    const { container } = render(<InputNumber onChange={() => {}} />);
    const label = container.querySelector('label');
    expect(label).not.toBeInTheDocument();
  });

  it('applies input-large class when large prop is true', () => {
    const { container } = render(<InputNumber large onChange={() => {}} />);
    const input = container.querySelector('.input-large');
    expect(input).toBeInTheDocument();
  });

  it('has number type', () => {
    render(<InputNumber onChange={() => {}} />);
    const input = screen.getByPlaceholderText('4');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('has min and max attributes', () => {
    render(<InputNumber onChange={() => {}} />);
    const input = screen.getByPlaceholderText('4');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '300');
  });

  it('calls onChange with correct format when value changes', () => {
    const handleChange = jest.fn();
    render(<InputNumber onChange={handleChange} />);

    const input = screen.getByPlaceholderText('4');
    fireEvent.change(input, { target: { value: '10' } });

    expect(handleChange).toHaveBeenCalledWith({ amount: '10' });
  });

  it('calls onChange multiple times', () => {
    const handleChange = jest.fn();
    render(<InputNumber onChange={handleChange} />);

    const input = screen.getByPlaceholderText('4');

    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.change(input, { target: { value: '15' } });

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenLastCalledWith({ amount: '15' });
  });

  it('applies base CSS classes', () => {
    const { container } = render(<InputNumber onChange={() => {}} />);
    const input = container.querySelector('.align-center.input-left-label');
    expect(input).toBeInTheDocument();
  });
});
