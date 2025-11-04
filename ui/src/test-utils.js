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
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function that wraps components with common providers
 * Use this instead of the standard render from @testing-library/react
 * when components need routing context
 */
export function renderWithRouter(ui, { route = '/', ...renderOptions } = {}) {
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Mock service functions for testing
 * Replace these with actual mocked implementations as needed
 */
export const mockService = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
};

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  accountType: 'StudentPremium',
  name: 'Test User',
};

/**
 * Mock exercise data for testing
 */
export const mockExercise = {
  id: 1,
  name: 'Push-ups',
  description: 'Standard push-up exercise',
  complexity: 'Beginner',
  muscles: ['Chest', 'Triceps', 'Shoulders'],
};

/**
 * Mock routine data for testing
 */
export const mockRoutine = {
  id: 1,
  name: 'Morning Workout',
  description: 'Quick morning routine',
  exercises: [mockExercise],
};

/**
 * Mock planification data for testing
 */
export const mockPlanification = {
  id: 1,
  name: 'Weekly Plan',
  description: 'Weekly workout plan',
  routines: [mockRoutine],
};

/**
 * Wait for async operations to complete
 * Useful for testing async components
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Create a mock file for upload testing
 */
export function createMockFile(name = 'test.jpg', size = 1024, type = 'image/jpeg') {
  const file = new File(['test'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

/**
 * Suppress console errors/warnings during specific tests
 * Useful when testing error boundaries or expected console output
 */
export function suppressConsole() {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
}

export default {
  renderWithRouter,
  mockService,
  mockUser,
  mockExercise,
  mockRoutine,
  mockPlanification,
  waitForAsync,
  createMockFile,
  suppressConsole,
};
