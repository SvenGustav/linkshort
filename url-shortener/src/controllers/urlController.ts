import { Request, Response } from 'express';
import { Url } from '../models/url';
import { generateShortId } from '../utils/shortid';
import crypto from 'crypto';
import { customAlphabet } from 'nanoid';

// Define a custom alphabet for statsId to make it more user-friendly
const statsIdAlphabet = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const generateStatsId = customAlphabet(statsIdAlphabet, 8); // Generate an 8-character statsId

export class UrlController {
    public async createShortUrl(req: Request, res: Response): Promise<Response> {
        try {
            let { originalUrl } = req.body;

            // Normalize URL
            try {
                // Add protocol if missing
                if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
                    originalUrl = 'https://' + originalUrl;
                }

                const urlObj = new URL(originalUrl);
                // Normalize hostname (remove www if present)
                if (urlObj.hostname.startsWith('www.')) {
                    urlObj.hostname = urlObj.hostname.replace('www.', '');
                }
                originalUrl = urlObj.toString();
            } catch (err) {
                return res.status(400).json({ error: 'Invalid URL provided' });
            }

            // Check if URL already exists
            const existingUrl = await Url.findOne({ originalUrl });
            if (existingUrl) {
                return res.status(200).json({
                    shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${existingUrl.shortUrl}`,
                    originalUrl: existingUrl.originalUrl,
                    clicks: existingUrl.clicks,
                    id: existingUrl.shortUrl
                });
            }

            // Generate a 6-character short ID (excluding confusing characters like I, l, 1, 0, O)
            const shortUrl = generateShortId();

            const url = new Url({ originalUrl, shortUrl }); // Removed statsId
            await url.save();

            return res.status(201).json({
                shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${shortUrl}`,
                statsPage: `${process.env.BASE_URL || 'http://localhost:3000'}/stats/${shortUrl}`, // Use shortUrl for stats
                originalUrl: url.originalUrl,
                clicks: 0,
                id: shortUrl // Use shortUrl as the ID for stats
            });
        } catch (error) {
            console.error('Error creating short URL:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async redirectToUrl(req: Request, res: Response): Promise<void> {
        try {
            const { shortUrl } = req.params;
            const url = await Url.findOne({ shortUrl });

            if (!url) {
                res.status(404).json({ error: 'URL not found' });
                return;
            }

            // Increment click counter
            url.clicks++;
            await url.save();

            res.redirect(url.originalUrl);
        } catch (error) {
            console.error('Error redirecting to URL:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getUrlStats(req: Request, res: Response): Promise<Response> {
        try {
            const { shortUrl } = req.params; // Use shortUrl instead of statsId
            console.log('Received request for stats with shortUrl:', shortUrl); // Log the incoming request
            console.log('Fetching stats for shortUrl:', shortUrl); // Log the shortUrl being queried
            const url = await Url.findOne({ shortUrl }); // Query using shortUrl
            console.log('Database query result:', url); // Log the result of the database query

            if (!url) {
                console.error('No URL found for shortUrl:', shortUrl); // Log if no URL is found
                return res.status(404).json({ error: 'URL not found' });
            }

            return res.status(200).json({
                originalUrl: url.originalUrl,
                shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${url.shortUrl}`,
                clicks: url.clicks,
                createdAt: url.createdAt
            });
        } catch (error) {
            console.error('Error getting URL stats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}