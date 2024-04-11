import express from 'express';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = 8080;
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

