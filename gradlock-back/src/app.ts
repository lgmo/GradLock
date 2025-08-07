import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './config/swaggerConfig';

import { AppError, InternalServerError, ValidationError } from './errors/httpErrors';
import apiRouter from './routes/api';
import { z } from 'zod';

const app = express();

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const swaggerDocs = swaggerJSDoc(swaggerConfig);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiRouter);

// Middleware de tratamento de erros com tipagem do Express
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(`error:\n${error.stack}`);

  let errorToClient = error;

  if (error instanceof z.ZodError) {
    const errorMessages = error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : '(request body)';
        return `${path}: ${issue.message}`;
      })
      .join('\n');

    errorToClient = new ValidationError(errorMessages);
  }

  if (!(error instanceof AppError)) {
    errorToClient = new InternalServerError();
  }

  res.status(errorToClient.statusCode).json({
    status: errorToClient.status,
    message: errorToClient.message,
    success: false,
  });
};

app.use(errorHandler);

export default app;
