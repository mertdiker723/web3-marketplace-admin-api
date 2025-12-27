import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

dotenv.config();

// Routers
import router from './routers';

const corsURL = 'http://localhost:5173'; // --> will be handled

(() => {
  try {
    const app = express();

    // Middlewares
    app.use(express.json());
    app.use(helmet());
    app.use(
      cors({
        origin: [corsURL],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authentication'],
      })
    );
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

    // Routes
    app.use('/api', router);

    const port = Number(process.env.PORT ?? 3000);

    app.listen(port, () => {
      console.info(`🚀 Server running on ${port}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
})();
