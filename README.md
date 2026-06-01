# WHOIS Domain Lookup

A modern Vue 3 + Vite web application for querying WHOIS and RDAP information for domain names.

## Features

- **WHOIS Query**: Traditional WHOIS protocol lookup via TCP port 43
- **RDAP Query**: Modern RDAP (Registration Data Access Protocol) with JSON responses
- **Domain Pricing**: View registration, renewal, and transfer prices for common TLDs
- **PWA Support**: Installable Progressive Web App with offline capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dual Data Sources**: Toggle between WHOIS and RDAP data or use both simultaneously

## Tech Stack

### Frontend
- Vue 3 (Composition API)
- Vite
- Vue Router
- Pinia (State Management)
- Axios (HTTP Client)

### Backend
- Node.js + Express
- Native TCP sockets for WHOIS queries
- Axios for RDAP HTTP requests

## Project Structure

```
whois-page/
├── frontend/          # Vue 3 frontend application
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── views/         # Page views
│   │   ├── stores/        # Pinia stores
│   │   ├── router/        # Vue Router config
│   │   ├── styles/        # CSS styles
│   │   └── main.js        # App entry point
│   ├── public/            # Static assets
│   └── index.html
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── parsers/       # WHOIS data parsers
│   │   └── data/          # Server mapping data
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd whois-page
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:3000
   ```

2. In a new terminal, start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

3. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`.

## API Endpoints

### WHOIS Query
```
GET /api/whois?domain=example.com
```

### RDAP Query
```
GET /api/rdap?domain=example.com
```

### Domain Prices
```
GET /api/prices?domain=example.com
```

### Health Check
```
GET /api/health
```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Supported TLDs

The application supports WHOIS queries for most common TLDs including:
- Generic: .com, .net, .org, .info, .biz, .io, .co, .me, etc.
- Country code: .cn, .uk, .de, .jp, .ru, .au, .ca, .fr, .it, .nl, etc.

RDAP support depends on registry adoption. Common RDAP-enabled TLDs include:
- .com, .net, .org
- Most new gTLDs (.app, .dev, .blog, etc.)
- Some ccTLDs

## Deployment

### Deploy to Alibaba Cloud ESA / Tencent Cloud EO Pages

This project supports automatic deployment from GitHub:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/whois-domain-lookup.git
   git push -u origin main
   ```

2. **Configure on Alibaba Cloud ESA or Tencent Cloud EO**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `frontend/dist`
   - Set start command: `node backend/server.js`
   - Add environment variable: `NODE_ENV=production`

3. **Auto-deploy on push**
   - Every push to the main branch will trigger automatic build and deployment

### Other Platforms

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions for:
- Vercel
- Render
- Railway
- Docker

## License

MIT
