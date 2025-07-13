import express, { Application, Request, Response } from 'express';
import { productRoutes } from './app/controllers/products.controller';
import { categoryRoutes } from './app/controllers/categories.controller';

const app: Application = express();
app.use(express.json())

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to 6sense challenge app');
})


export default app;