import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

describe('getRandomDogImage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the image URL and success status', async () => {
    const mockedData = {
      message:
        'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success',
    };

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockedData),
      } as unknown as Response);

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockedData.message);
    expect(result.status).toBe('success');
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('throws an error when the API returns status 500', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: false,
        status: 500,
      } as unknown as Response);

    await expect(getRandomDogImage()).rejects.toThrow(
      'Failed to fetch dog image: Dog API returned status 500'
    );

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
