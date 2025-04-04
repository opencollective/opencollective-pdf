import express from 'express';
import { sendPDFResponse } from '../utils/pdf';
import GiftCardsPage from '../components/gift-cards/GiftCardsPage';

const router = express.Router();

const getCardsFromBody = async (req: express.Request) => {
  if (req.method === 'POST') {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (data: Buffer) => {
        body += data;

        // Too much POST data, kill the connection!
        // 1e7 ~ 10MB
        if (body.length > 1e7) {
          reject(req.socket.destroy());
        }
      });

      req.on('end', () => {
        resolve(JSON.parse(body)?.cards);
      });
    });
  } else if (req.query.cards) {
    return JSON.parse(req.query.cards as string);
  }
};

router.options(':filename.pdf', (req, res) => {
  res.sendStatus(204);
});

router.get('/:filename.pdf', async (req: express.Request, res: express.Response) => {
  const { filename } = req.params;
  if (!filename) {
    res.status(400).json({ message: 'Filename is required' });
    return;
  }

  const cards = await getCardsFromBody(req);
  await sendPDFResponse(res, GiftCardsPage, { cards });
});

export default router;
