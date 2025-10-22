'use client';

import React, { useState, useEffect } from 'react';
import { Star, Filter, TrendingUp, Calendar, MapPin, ThumbsUp, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ReviewCategory {
  category: string;
  rating: number;
}

interface Review {
  id: number;
  type: string;
  status: string;
  rating: number;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  isApproved: boolean;
}

export default function FlexLivingDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [filterRating, setFilterRating] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/reviews/hostaway`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to mock data if API fails
      setReviews(getMockReviews());
    } finally {
      setLoading(false);
    }
  };

  const getMockReviews = (): Review[] => [
    {
      id: 7453,
      type: "guest-to-host",
      status: "published",
      rating: 9.5,
      publicReview: "Amazing stay! The property was clean, modern, and in a great location. Host was very responsive.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "location", rating: 9 },
        { category: "value", rating: 9 }
      ],
      submittedAt: "2024-10-15 14:30:22",
      guestName: "Sarah Johnson",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      channel: "Airbnb",
      isApproved: false
    },
    {
      id: 7454,
      type: "guest-to-host",
      status: "published",
      rating: 8.5,
      publicReview: "Great apartment in central location. Could use better kitchen equipment but overall excellent.",
      reviewCategory: [
        { category: "cleanliness", rating: 9 },
        { category: "communication", rating: 9 },
        { category: "location", rating: 10 },
        { category: "value", rating: 8 }
      ],
      submittedAt: "2024-10-12 09:15:44",
      guestName: "Michael Chen",
      listingName: "1B S2 B - 15 Camden Court",
      channel: "Booking.com",
      isApproved: true
    },
    {
      id: 7455,
      type: "guest-to-host",
      status: "published",
      rating: 10,
      publicReview: "Perfect! Everything was as described. The check-in process was smooth and the place was spotless.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "location", rating: 10 },
        { category: "value", rating: 10 }
      ],
      submittedAt: "2024-10-18 16:22:11",
      guestName: "Emma Wilson",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      channel: "Airbnb",
      isApproved: true
    },
    {
      id: 7456,
      type: "guest-to-host",
      status: "published",
      rating: 7.0,
      publicReview: "Decent place but had some issues with noise from neighbors. Location is good though.",
      reviewCategory: [
        { category: "cleanliness", rating: 8 },
        { category: "communication", rating: 9 },
        { category: "location", rating: 9 },
        { category: "value", rating: 6 }
      ],
      submittedAt: "2024-10-08 11:45:33",
      guestName: "David Martinez",
      listingName: "Studio W1 - 42 Westminster Plaza",
      channel: "Vrbo",
      isApproved: false
    },
    {
      id: 7457,
      type: "guest-to-host",
      status: "published",
      rating: 9.2,
      publicReview: "Loved our stay! Modern furnishings and great amenities. Would definitely recommend.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 9 },
        { category: "location", rating: 9 },
        { category: "value", rating: 9 }
      ],
      submittedAt: "2024-10-20 13:55:28",
      guestName: "Lisa Anderson",
      listingName: "1B S2 B - 15 Camden Court",
      channel: "Airbnb",
      isApproved: true
    }
  ];

  const toggleApproval = async (id: number) => {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    try {
      await axios.post(`${API_URL}/api/reviews/${id}/approve`, {
        approved: !review.isApproved
      });
      setReviews(reviews.map(r => 
        r.id === id ? { ...r, isApproved: !r.isApproved } : r
      ));
    } catch (error) {
      console.error('Error toggling approval:', error);
      // Update locally even if API fails
      setReviews(reviews.map(r => 
        r.id === id ? { ...r, isApproved: !r.isApproved } : r
      ));
    }
  };

  const properties = ['all', ...new Set(reviews.map(r => r.listingName))];
  const channels = ['all', ...new Set(reviews.map(r => r.channel))];

  const filteredReviews = reviews
    .filter(r => selectedProperty === 'all' || r.listingName === selectedProperty)
    .filter(r => filterChannel === 'all' || r.channel === filterChannel)
    .filter(r => {
      if (filterRating === 'all') return true;
      if (filterRating === 'high') return r.rating >= 9;
      if (filterRating === 'medium') return r.rating >= 7 && r.rating < 9;
      if (filterRating === 'low') return r.rating < 7;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const stats = {
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0',
    totalReviews: reviews.length,
    approvedReviews: reviews.filter(r => r.isApproved).length,
    recentReviews: reviews.filter(r => {
      const reviewDate = new Date(r.submittedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reviewDate > weekAgo;
    }).length
  };

  const propertyStats = properties.slice(1).map(prop => {
    const propReviews = reviews.filter(r => r.listingName === prop);
    return {
      name: prop,
      avgRating: propReviews.length > 0 ? (propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length).toFixed(1) : '0.0',
      count: propReviews.length,
      approved: propReviews.filter(r => r.isApproved).length
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FL</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">FlexLiving Reviews</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  view === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('public')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  view === 'public' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Public View
              </button>
            </div>
          </div>
        </div>
      </nav>

      {view === 'dashboard' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgRating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReviews}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.approvedReviews}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.recentReviews}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Property Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Property Performance</h2>
            <div className="space-y-4">
              {propertyStats.map((prop, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{prop.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{prop.count} reviews • {prop.approved} approved</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-500" size={20} fill="currentColor" />
                    <span className="text-xl font-bold text-gray-900">{prop.avgRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 border mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
                <select 
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {properties.map(prop => (
                    <option key={prop} value={prop}>{prop === 'all' ? 'All Properties' : prop}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                <select 
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {channels.map(ch => (
                    <option key={ch} value={ch}>{ch === 'all' ? 'All Channels' : ch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select 
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Ratings</option>
                  <option value="high">9+ (Excellent)</option>
                  <option value="medium">7-9 (Good)</option>
                  <option value="low">&lt;7 (Needs Attention)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {review.channel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{review.listingName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(review.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500" size={20} fill="currentColor" />
                      <span className="text-xl font-bold text-gray-900">{review.rating}</span>
                    </div>
                    <button
                      onClick={() => toggleApproval(review.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2 ${
                        review.isApproved 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {review.isApproved ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span>{review.isApproved ? 'Approved' : 'Approve'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.publicReview}</p>
                <div className="flex flex-wrap gap-3">
                  {review.reviewCategory.map((cat, idx) => (
                    <div key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                      <span className="text-gray-600 capitalize">{cat.category.replace(/_/g, ' ')}: </span>
                      <span className="font-semibold text-gray-900">{cat.rating}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Public Property View */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FlexLiving Properties</h1>
              <p className="text-gray-600 mb-8">Premium short-term accommodations in prime locations</p>
              
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
                <div className="space-y-6">
                  {reviews.filter(r => r.isApproved).map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{review.guestName}</p>
                          <p className="text-sm text-gray-600">{review.listingName}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < Math.round(review.rating / 2) ? 'text-yellow-500' : 'text-gray-300'}
                              fill={i < Math.round(review.rating / 2) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.publicReview}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.submittedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}