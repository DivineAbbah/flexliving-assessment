# Backend Setup Instructions

## Prerequisites
- Python 3.8+
- Virtual environment

## Installation

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   - create a new `.env` file in the backend directory with:
     ```env
     HOSTAWAY_ACCOUNT_ID=your_account_id
     HOSTAWAY_API_KEY=your_api_key
     ```

## Running the Server

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the development server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **Access the API:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs

## Environment Variables

The following environment variables are required:

- `HOSTAWAY_ACCOUNT_ID`: Your Hostaway account ID
- `HOSTAWAY_API_KEY`: Your Hostaway API key

## API Endpoints

- `GET /` - API information
- `GET /api/reviews/hostaway` - Fetch reviews from Hostaway API
- `GET /api/reviews/mock` - Get mock review data
- `GET /api/reviews/statistics` - Get review statistics
- `POST /api/reviews/{review_id}/approve` - Approve/reject a review
- `GET /health` - Health check

## Troubleshooting

- **Missing environment variables error**: Make sure the `.env` file exists in the backend directory
- **Import errors**: Ensure all dependencies are installed from requirements.txt