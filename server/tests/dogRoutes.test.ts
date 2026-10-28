import express, { type Request, type Response, } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi, } from 'vitest';

import { getDogImage } from '../controllers/dogController';
import dogRoutes from '../routes/dogRoutes';

vi.mock('../controllers/dogController');

describe('dogRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns status 200 and mocked dog data', async () => {
    const mockedDogData = {
      imageUrl:
        'https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg',
      status: 'success',
    };

    vi.mocked(getDogImage).mockImplementation(
      async (
        _req: Request,
        res: Response
      ): Promise<void> => {
        res.json({
          success: true,
          data: mockedDogData,
        });
      }
    );

    const app = express();
    app.use(express.json());
    app.use('/api/dog', dogRoutes);

    const response = await request(app)
      .get('/api/dog/random');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data.imageUrl).toBe(
      mockedDogData.imageUrl
    );

    expect(getDogImage).toHaveBeenCalledOnce();
  });

  it('returns status 500 and an error message', async () => {
    const errorMessage =
        'Failed to fetch dog image: Network error';

    vi.mocked(getDogImage).mockImplementation(
     async (
      _req: Request,
      res: Response
     ): Promise<void> => {
      res.status(500).json({
        success: false,
        error: errorMessage,
        });
        }
    );

    const app = express();
    app.use(express.json());
    app.use('/api/dog', dogRoutes);

     const response = await request(app)
      .get('/api/dog/random');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(errorMessage);
    expect(getDogImage).toHaveBeenCalledOnce();
});
});