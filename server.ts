import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';
import { initialize } from './_helpers/db';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// DB middleware
let initPromise: Promise<void> | null = null;
async function ensureDbInitialized() {
    if (!initPromise) {
        initPromise = initialize();
    }
    return initPromise;
}

const dbMiddleware = async (req: any, res: any, next: any) => {
    try {
        await ensureDbInitialized();
        next();
    } catch (err: any) {
        const errorMessage = err.message || err;
        console.error('Database initialization error:', errorMessage);
        res.status(500).json({ message: `Database initialization failed: ${errorMessage}` });
    }
};

app.use(dbMiddleware);
app.use('/accounts', accountsController);
app.use('/api-docs', swaggerDocs);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on port ' + port));