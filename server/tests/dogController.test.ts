import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getDogImage } from '../controllers/dogController';
import { getRandomDogImage } from '../services/dogService';

vi.mock('../services/dogService');

describe('getDogImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success true and mocked dog data', async () => {
    const mockedDogData = {
      imageUrl:
        'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success',
    };

    vi.mocked(getRandomDogImage).mockResolvedValue(mockedDogData);

    const req = {} as Request;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getDogImage(req, res);

    expect(getRandomDogImage).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledOnce();

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockedDogData,
    });
  });
});
