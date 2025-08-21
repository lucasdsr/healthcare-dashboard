import { HttpClient } from '../http-client';

// Mock fetch globally
global.fetch = jest.fn();

describe('HttpClient', () => {
  let httpClient: HttpClient;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    httpClient = new HttpClient('https://api.example.com');
    mockFetch.mockClear();
  });

  describe('constructor', () => {
    it('should create client with base URL and default headers', () => {
      expect(httpClient).toBeInstanceOf(HttpClient);
      expect(httpClient.getHeaders()).toEqual({
        'Content-Type': 'application/json',
        Accept: 'application/fhir+json',
      });
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await httpClient.get('/test');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/fhir+json',
          },
        })
      );
    });

    it('should handle query parameters', async () => {
      const mockResponse = { data: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const params = { page: '1', limit: '10' };
      await httpClient.get('/test', params);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test?page=1&limit=10',
        expect.any(Object)
      );
    });

    it('should throw error on non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(httpClient.get('/test')).rejects.toThrow(
        'HTTP 404: Not Found'
      );
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockResponse = { id: '123', data: 'test' };
      const postData = { name: 'test' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await httpClient.post('/test', postData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/fhir+json',
          },
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockResponse = { id: '123', data: 'updated' };
      const putData = { name: 'updated' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await httpClient.put('/test/123', putData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test/123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData),
        })
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await httpClient.delete('/test/123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test/123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('header management', () => {
    it('should set custom header', () => {
      httpClient.setHeader('Authorization', 'Bearer token');

      expect(httpClient.getHeaders()).toEqual({
        'Content-Type': 'application/json',
        Accept: 'application/fhir+json',
        Authorization: 'Bearer token',
      });
    });

    it('should remove header', () => {
      httpClient.setHeader('Authorization', 'Bearer token');
      httpClient.removeHeader('Authorization');

      expect(httpClient.getHeaders()).not.toHaveProperty('Authorization');
    });
  });
});
