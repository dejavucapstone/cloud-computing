import dotenv from "dotenv"
import express, { json } from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
dotenv.config()

import docsRoutes from './services/docs/routes/docsRoutes.js';
import authRoutes from './services/auth/routes/authRoutes.js';
import userRoutes from './services/user/routes/userRoutes.js';
import historyRoutes from './services/history/routes/historyRoutes.js';
import exerciseRoutes from './services/exercise/routes/exerciseRoutes.js';

const swaggerDocument = YAML.load('./docs/cleaned-api-docs.yaml');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).send('API is running!'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/exercise', exerciseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
