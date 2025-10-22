from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="FlexLiving Reviews API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hostaway API Configuration
HOSTAWAY_ACCOUNT_ID = os.getenv("HOSTAWAY_ACCOUNT_ID")
HOSTAWAY_API_KEY = os.getenv("HOSTAWAY_API_KEY")
HOSTAWAY_BASE_URL = "https://api.hostaway.com/v1"

# Validate required environment variables
if not HOSTAWAY_ACCOUNT_ID or not HOSTAWAY_API_KEY:
    raise ValueError("Missing required environment variables: HOSTAWAY_ACCOUNT_ID and HOSTAWAY_API_KEY must be set")

# Models
class ReviewCategory(BaseModel):
    category: str
    rating: int

class Review(BaseModel):
    id: int
    type: str
    status: str
    rating: Optional[float]
    publicReview: str
    reviewCategory: List[ReviewCategory]
    submittedAt: str
    guestName: str
    listingName: str
    channel: str = "Hostaway"
    isApproved: bool = False

# Mock data for demonstration
MOCK_REVIEWS = [
    {
        "id": 7453,
        "type": "guest-to-host",
        "status": "published",
        "rating": 9.5,
        "publicReview": "Amazing stay! The property was clean, modern, and in a great location. Host was very responsive.",
        "reviewCategory": [
            {"category": "cleanliness", "rating": 10},
            {"category": "communication", "rating": 10},
            {"category": "location", "rating": 9},
            {"category": "value", "rating": 9}
        ],
        "submittedAt": "2024-10-15 14:30:22",
        "guestName": "Sarah Johnson",
        "listingName": "2B N1 A - 29 Shoreditch Heights",
        "channel": "Airbnb"
    },
    {
        "id": 7454,
        "type": "guest-to-host",
        "status": "published",
        "rating": 8.5,
        "publicReview": "Great apartment in central location. Could use better kitchen equipment but overall excellent.",
        "reviewCategory": [
            {"category": "cleanliness", "rating": 9},
            {"category": "communication", "rating": 9},
            {"category": "location", "rating": 10},
            {"category": "value", "rating": 8}
        ],
        "submittedAt": "2024-10-12 09:15:44",
        "guestName": "Michael Chen",
        "listingName": "1B S2 B - 15 Camden Court",
        "channel": "Booking.com"
    },
    {
        "id": 7455,
        "type": "guest-to-host",
        "status": "published",
        "rating": 10.0,
        "publicReview": "Perfect! Everything was as described. The check-in process was smooth and the place was spotless.",
        "reviewCategory": [
            {"category": "cleanliness", "rating": 10},
            {"category": "communication", "rating": 10},
            {"category": "location", "rating": 10},
            {"category": "value", "rating": 10}
        ],
        "submittedAt": "2024-10-18 16:22:11",
        "guestName": "Emma Wilson",
        "listingName": "2B N1 A - 29 Shoreditch Heights",
        "channel": "Airbnb"
    },
    {
        "id": 7456,
        "type": "guest-to-host",
        "status": "published",
        "rating": 7.0,
        "publicReview": "Decent place but had some issues with noise from neighbors. Location is good though.",
        "reviewCategory": [
            {"category": "cleanliness", "rating": 8},
            {"category": "communication", "rating": 9},
            {"category": "location", "rating": 9},
            {"category": "value", "rating": 6}
        ],
        "submittedAt": "2024-10-08 11:45:33",
        "guestName": "David Martinez",
        "listingName": "Studio W1 - 42 Westminster Plaza",
        "channel": "Vrbo"
    },
    {
        "id": 7457,
        "type": "guest-to-host",
        "status": "published",
        "rating": 9.2,
        "publicReview": "Loved our stay! Modern furnishings and great amenities. Would definitely recommend.",
        "reviewCategory": [
            {"category": "cleanliness", "rating": 10},
            {"category": "communication", "rating": 9},
            {"category": "location", "rating": 9},
            {"category": "value", "rating": 9}
        ],
        "submittedAt": "2024-10-20 13:55:28",
        "guestName": "Lisa Anderson",
        "listingName": "1B S2 B - 15 Camden Court",
        "channel": "Airbnb"
    }
]

@app.get("/")
def read_root():
    return {
        "message": "FlexLiving Reviews API",
        "version": "1.0.0",
        "endpoints": {
            "/api/reviews/hostaway": "Get normalized reviews from Hostaway",
            "/api/reviews/mock": "Get mock review data",
            "/docs": "API documentation"
        }
    }

@app.get("/api/reviews/hostaway")
async def get_hostaway_reviews():
    """
    Fetch and normalize reviews from Hostaway API.
    Since the sandbox is empty, this returns mock data with proper normalization.
    """
    try:
        # Attempt to fetch from Hostaway API
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {HOSTAWAY_API_KEY}",
                "Content-Type": "application/json"
            }
            
            # Try to fetch real reviews
            try:
                response = await client.get(
                    f"{HOSTAWAY_BASE_URL}/reviews",
                    headers=headers,
                    params={"accountId": HOSTAWAY_ACCOUNT_ID},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # If API returns reviews, normalize them
                    if data.get("result") and len(data["result"]) > 0:
                        normalized_reviews = normalize_hostaway_reviews(data["result"])
                        return {
                            "status": "success",
                            "source": "hostaway_api",
                            "count": len(normalized_reviews),
                            "reviews": normalized_reviews
                        }
            except Exception as e:
                print(f"Hostaway API error: {e}")
        
        # Fallback to mock data (as sandbox is empty)
        return {
            "status": "success",
            "source": "mock_data",
            "message": "Using mock data as Hostaway sandbox contains no reviews",
            "count": len(MOCK_REVIEWS),
            "reviews": MOCK_REVIEWS
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reviews: {str(e)}")

@app.get("/api/reviews/mock")
def get_mock_reviews():
    """Get mock review data for testing"""
    return {
        "status": "success",
        "source": "mock",
        "count": len(MOCK_REVIEWS),
        "reviews": MOCK_REVIEWS
    }

def normalize_hostaway_reviews(raw_reviews: list) -> list:
    """
    Normalize Hostaway review data to consistent format
    """
    normalized = []
    
    for review in raw_reviews:
        # Calculate overall rating from categories if not provided
        rating = review.get("rating")
        if not rating and review.get("reviewCategory"):
            category_ratings = [cat.get("rating", 0) for cat in review["reviewCategory"]]
            rating = sum(category_ratings) / len(category_ratings) if category_ratings else 0
        
        # Determine channel (would come from listing data in production)
        channel = "Hostaway"  # Default, would be enriched with actual channel data
        
        normalized_review = {
            "id": review.get("id"),
            "type": review.get("type", "guest-to-host"),
            "status": review.get("status", "published"),
            "rating": rating,
            "publicReview": review.get("publicReview", ""),
            "reviewCategory": review.get("reviewCategory", []),
            "submittedAt": review.get("submittedAt", ""),
            "guestName": review.get("guestName", "Anonymous"),
            "listingName": review.get("listingName", "Unknown Property"),
            "channel": channel,
            "isApproved": False
        }
        normalized.append(normalized_review)
    
    return normalized

@app.get("/api/reviews/statistics")
def get_review_statistics():
    """Get aggregated statistics for all reviews"""
    reviews = MOCK_REVIEWS
    
    if not reviews:
        return {
            "status": "success",
            "statistics": {
                "total_reviews": 0,
                "average_rating": 0,
                "approved_count": 0,
                "by_property": [],
                "by_channel": []
            }
        }
    
    # Calculate statistics
    total_reviews = len(reviews)
    avg_rating = sum(r["rating"] for r in reviews) / total_reviews if total_reviews > 0 else 0
    approved_count = sum(1 for r in reviews if r.get("isApproved", False))
    
    # Group by property
    property_stats = {}
    for review in reviews:
        prop = review["listingName"]
        if prop not in property_stats:
            property_stats[prop] = {"count": 0, "total_rating": 0}
        property_stats[prop]["count"] += 1
        property_stats[prop]["total_rating"] += review["rating"]
    
    by_property = [
        {
            "property": prop,
            "count": stats["count"],
            "average_rating": stats["total_rating"] / stats["count"]
        }
        for prop, stats in property_stats.items()
    ]
    
    # Group by channel
    channel_stats = {}
    for review in reviews:
        channel = review["channel"]
        if channel not in channel_stats:
            channel_stats[channel] = 0
        channel_stats[channel] += 1
    
    by_channel = [{"channel": ch, "count": cnt} for ch, cnt in channel_stats.items()]
    
    return {
        "status": "success",
        "statistics": {
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2),
            "approved_count": approved_count,
            "by_property": by_property,
            "by_channel": by_channel
        }
    }

@app.post("/api/reviews/{review_id}/approve")
def approve_review(review_id: int, approved: bool = True):
    """Toggle review approval status"""
    # In production, this would update a database
    return {
        "status": "success",
        "review_id": review_id,
        "approved": approved,
        "message": f"Review {review_id} approval status updated"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}