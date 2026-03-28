import '@testing-library/jest-dom';
// This import/add all custom matchers to Vitest's expect() function
import { server } from './src/mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// 1. Start the fake server BEFORE all tests run.
beforeAll(() => server.listen());

// 2. Reset any temporary rules we add during specific tests AFTER each test finishes.
// This guarantees Test Isolation (Module 0).
afterEach(() => server.resetHandlers());

// 3. Shut down the fake server AFTER all tests are completely done.
afterAll(() => server.close());
