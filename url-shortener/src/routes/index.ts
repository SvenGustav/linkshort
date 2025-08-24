import { Router, Request, Response } from 'express';
import { UrlController } from '../controllers/urlController';
import { Url } from '../models/url';
const path = require('path');

const router = Router();
const urlController = new UrlController();

export function setRoutes(app: any) {
    // API routes
    const apiRouter = Router();
    apiRouter.post('/shorten', urlController.createShortUrl.bind(urlController));
    apiRouter.get('/stats/:shortUrl', urlController.getUrlStats.bind(urlController)); // Updated to use shortUrl
    app.use('/api/url', apiRouter);

    // Home route - serve index.html
    app.get('/', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, '../public/index.html'));
    });

    // Sitemap route
    app.get('/sitemap.xml', (req: Request, res: Response) => {
        res.set('Content-Type', 'text/xml');
        res.sendFile(path.resolve(__dirname, '../public/sitemap.xml'));
    });

    // Robots.txt route
    app.get('/robots.txt', (req: Request, res: Response) => {
        res.set('Content-Type', 'text/plain');
        res.sendFile(path.resolve(__dirname, '../public/robots.txt'));
    });

    // Stats page route - serve the HTML file
    app.get('/stats/:shortUrl', (req: Request, res: Response) => {
        console.log('Serving stats.html for shortUrl:', req.params.shortUrl);
        res.sendFile(path.resolve(__dirname, '../public/stats.html'));
    });

    // Redirect route at root level (this should be last to avoid conflicts)
    app.get('/:shortUrl', urlController.redirectToUrl.bind(urlController));
}