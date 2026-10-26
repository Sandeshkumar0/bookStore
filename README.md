# BookStore

A full-stack MERN bookstore with secure authentication, a searchable catalog, persistent cart, dark mode, and responsive UI.

## Highlights

- JWT authentication with server-side session verification
- Password hashing, request validation, auth rate limiting, Helmet, and restricted CORS
- Catalog search, category filters, sorting, pagination, and book detail endpoint
- Persistent shopping cart with quantities and order summary
- Loading, error, empty, and 404 states
- Responsive navigation and accessible forms and controls
- Health endpoint, graceful shutdown, sample data seeder, and backend unit tests

## Local setup

Requirements: Node.js 20+, npm, and MongoDB.

1. Configure the backend:

   ```bash
   cd Backend
   cp .env.example .env
   npm install
   npm run seed
   npm run dev
   ```

2. In another terminal, start the frontend:

   ```bash
   cd Frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

The app runs at `http://localhost:5173` and the API at `http://localhost:4000`.

## Environment variables

Backend:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `4000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random signing secret; required in production |
| `CLIENT_ORIGIN` | Allowed frontend origin; comma-separated when needed |

Frontend:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend base URL |

## Commands

- `Backend`: `npm run dev`, `npm start`, `npm test`, `npm run seed`
- `Frontend`: `npm run dev`, `npm run lint`, `npm run build`, `npm run preview`

## API

- `GET /health`
- `POST /user/signup`
- `POST /user/login`
- `GET /user/me` (Bearer token required)
- `GET /book?search=&category=&sort=&page=&limit=&minPrice=&maxPrice=`
- `GET /book/:id`

## Security note

The original repository committed a MongoDB connection string in `Backend/.env`. That file is now ignored, but the credential remains in Git history. Rotate the MongoDB password before deploying and purge the secret from repository history if this repository is public.
