import '@testing-library/jest-dom';
// import { server } from './mocks/server';

// Mock Response global for MSW in Node.js environment
global.Response = class Response {
  constructor(body?: any, init?: any) {
    Object.assign(this, init);
  }
} as any;

// Mock TextEncoder and TextDecoder for MSW
global.TextEncoder = class TextEncoder {
  encode(input?: string): Uint8Array {
    return new Uint8Array(Buffer.from(input || '', 'utf8'));
  }
} as any;

global.TextDecoder = class TextDecoder {
  decode(input?: Uint8Array): string {
    return Buffer.from(input || new Uint8Array()).toString('utf8');
  }
} as any;

// Mock TransformStream for MSW
global.TransformStream = class TransformStream {
  readable: any;
  writable: any;

  constructor() {
    this.readable = new ReadableStream();
    this.writable = new WritableStream();
  }
} as any;

// Mock ReadableStream and WritableStream
global.ReadableStream = class ReadableStream {} as any;
global.WritableStream = class WritableStream {} as any;

// Mock BroadcastChannel for MSW
global.BroadcastChannel = class BroadcastChannel {
  constructor(channel: string) {}
  postMessage(message: any) {}
  addEventListener(type: string, listener: any) {}
  removeEventListener(type: string, listener: any) {}
  close() {}
} as any;

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
) as any;

// MSW setup - temporarily disabled to focus on basic tests
// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
} as any;

global.performance = {
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(name => [
    {
      duration: 100,
      name: name,
      startTime: 0,
      entryType: 'measure',
    },
  ]),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  now: jest.fn(() => Date.now()),
} as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.sessionStorage = sessionStorageMock as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(callback => {
  setTimeout(callback, 0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock console methods in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: componentWillReceiveProps')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
