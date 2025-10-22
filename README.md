# FlexLiving Reviews Dashboard

The follow through guidelines on the implementation done for my assessment

## Features

### Manager Dashboard
- **Real-time Analytics**: Average ratings, total reviews, approval status
- **Property Performance**: Per-property metrics and comparison
- **Advanced Filtering**: By property, channel, rating, and date
- **Review Approval**: One-click approval/disapproval system
- **Sorting Options**: By date or rating
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

### Public Display
- **Curated Reviews**: Shows only manager-approved reviews
- **Professional Layout**: Consistent with property listing pages
- **Responsive Design**: Works on all devices
- **Formatted Dates**: User-friendly date display

### API Integration
- **Hostaway Integration**: Fetches and normalizes review data
- **Statistics Endpoint**: Aggregated metrics and insights
- **Mock Data Fallback**: Graceful handling of API failures
- **RESTful Design**: Standard REST API patterns

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Axios (HTTP Client)

**Backend**
- Python 3.9+
- FastAPI
- HTTPX (Async HTTP)
- Pydantic (Data Validation)
- Uvicorn (ASGI Server)

**Deployment**
- Vercel (Frontend & Serverless Functions)

## Quick Start

### Prerequisites
```bash
Node.js 18+
Python 3.9+
npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/flexliving-reviews.git
cd flexliving-reviews
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Setup backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Configure environment variables**

Create `.env.local` in project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `.env` in backend directory:
```env
HOSTAWAY_ACCOUNT_ID= Your Account ID
HOSTAWAY_API_KEY= your hostaway api key
```

5. **Run development servers**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
uvicorn main:app --reload
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure

```

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Set environment variables** (In your vercel Dashbiard please set the env variables)
```
NEXT_PUBLIC_API_URL=https://flexliving-assessment.vercel.app/
HOSTAWAY_ACCOUNT_ID= your ID
HOSTAWAY_API_KEY=your key
```

## API Endpoints

### `GET /api/reviews/hostaway`
Fetch and normalize reviews from Hostaway API

**Response:**
```json
{
  "status": "success",
  "source": "hostaway_api",
  "count": 5,
  "reviews": [...]
}
```

### `GET /api/reviews/statistics`
This is getting the review statistics

**Response:**
```json
{
  "status": "success",
  "statistics": {
    "total_reviews": 5,
    "average_rating": 8.84,
    "approved_count": 3,
    "by_property": [...],
    "by_channel": [...]
  }
}
```

### `POST /api/reviews/{review_id}/approve`
I added toggle review for approval status

**Request:**
```json
{
  "approved": true
}
```

### `GET /health`
This is getting the health check

### Manager Dashboard
- Overview statistics cards
- Property performance metrics
- Advanced filtering system
- Review management interface

### Public View
- Approved reviews display
- Star rating visualization
- Property information
- Formatted timestamps

## Testing

### Run Frontend Tests
```bash
npm test
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Get reviews
curl http://localhost:8000/api/reviews/hostaway

# Get statistics
curl http://localhost:8000/api/reviews/statistics
```

### Manual Testing Checklist
- I checked that my dashboard loads successfully
- I checked that the statistics display correctly
- I checked that the filters work (property, channel, rating)
- I checked that the sorting works (date, rating)
- The review approval toggles correctly
- The public view shows only approved reviews

## Key Design Decisions

### 1. Data Normalization
The backend normalizes Hostaway API responses to ensure consistent data structure:
- Calculates overall rating from category ratings
- Standardizes date formats
- Adds channel metadata
- Includes approval status

### 2. Graceful Degradation
I implemented that the system fall back to mock data since the hostaway api contains empty reviews, ensuring continuous operation.

### 3. Client-Side Filtering
Filtering and sorting happen on the client side to reduce API calls and improve performance.

### 4. Approval System
This reviews default to unapproved status, giving managers full control over public visibility.

## Google Reviews Integration (Exploration)

### Findings
Google Reviews can be integrated via Google Places API:

**Advantages:**
- Rich review data with photos
- High credibility and trust
- Real-time updates