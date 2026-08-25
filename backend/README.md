# Backend deployment

## Required environment variables

Set these values in your hosting provider's environment configuration:

- `MONGOOSE_URL`: a complete MongoDB connection string. For MongoDB Atlas, copy it from **Connect → Drivers** for the deployed cluster. Do not use a project URL or a placeholder hostname.
- `GEMINI_API_KEY`: a Gemini API key used for chat responses.
- `PORT`: optional. Hosting providers such as Render set this automatically.

Example format (replace every placeholder):

```text
MONGOOSE_URL=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
```

The server starts even while MongoDB is unavailable so the platform can perform health checks. `GET /health` returns `200` when MongoDB is connected and `503` while it is unavailable. Chat API requests also return `503` until the database reconnects; the server retries the connection every 30 seconds.
