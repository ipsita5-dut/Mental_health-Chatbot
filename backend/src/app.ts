import express, { Express } from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes';
import cookieParser from 'cookie-parser'
import cors from 'cors'
config();
const app: Express = express();

app.use(cors({origin:"http://localhost:5173", credentials: true}))
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan('dev'))


app.use("/api/v1", appRouter)

export default app;