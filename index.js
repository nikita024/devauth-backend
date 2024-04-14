import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
