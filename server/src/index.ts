import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get('/appointments', async (req: Request, res: Response) => {
  const dateParam = req.query.date;

  if (!dateParam || typeof dateParam !== 'string') {
    return res.status(400).json({ error: 'Date query parameter is required' });
  }

  const date = new Date(dateParam);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        time: {
          gte: start,
          lte: end,
        },
      },
    });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching appointments' });
  }
});

app.listen(4000, () => {
  console.log('🚀 Server is running on http://localhost:4000');
});
