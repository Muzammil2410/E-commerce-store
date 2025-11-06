'use client'

import { Star, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';

const SellerReviewModal = ({ reviewModal, setReviewModal }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    useEffect(() => {
        // Load existing review if any
        if (reviewModal?.orderId && reviewModal?.buyerId) {
            const existingReviews = JSON.parse(localStorage.getItem('sellerReviews') || '[]');
            const existing = existingReviews.find(
                r => r.orderId === reviewModal.orderId && r.buyerId === reviewModal.buyerId
            );
            if (existing) {
                setRating(existing.rating);
                setReview(existing.review);
            }
        }
    }, [reviewModal]);

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            return toast.error('Please select a rating');
        }
        if (review.length < 5) {
            return toast.error('Please write a review (minimum 5 characters)');
        }

        // Save to localStorage (frontend only)
        const existingReviews = JSON.parse(localStorage.getItem('sellerReviews') || '[]');
        const newReview = {
            id: `seller_review_${Date.now()}`,
            orderId: reviewModal.orderId,
            buyerId: reviewModal.buyerId,
            buyerName: reviewModal.buyerName,
            buyerEmail: reviewModal.buyerEmail,
            rating,
            review,
            createdAt: new Date().toISOString(),
        };

        // Remove existing review for this order if any
        const filteredReviews = existingReviews.filter(
            r => !(r.orderId === reviewModal.orderId && r.buyerId === reviewModal.buyerId)
        );
        filteredReviews.push(newReview);
        localStorage.setItem('sellerReviews', JSON.stringify(filteredReviews));

        toast.success('Review submitted successfully!');
        setReviewModal(null);
        setRating(0);
        setReview('');
    }

    return (
        <div 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
            onClick={(e) => e.target === e.currentTarget && setReviewModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-review-title"
        >
            <div className='bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md relative'>
                <button 
                    onClick={() => setReviewModal(null)} 
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
                    aria-label="Close review modal"
                >
                    <X size={20} />
                </button>
                <h2 id="seller-review-title" className='text-xl font-semibold text-slate-800 mb-2'>
                    Review Buyer
                </h2>
                <p className='text-sm text-gray-600 mb-4'>
                    Review for: <span className="font-medium">{reviewModal?.buyerName || 'Buyer'}</span>
                </p>
                <div className='flex items-center justify-center mb-4' role="group" aria-label="Rating">
                    {Array.from({ length: 5 }, (_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i + 1)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setRating(i + 1);
                                }
                            }}
                            aria-label={`Rate ${i + 1} out of 5 stars`}
                            className={`focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${
                                rating > i ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                        >
                            <Star size={32} className="cursor-pointer hover:scale-110 transition-transform" />
                        </button>
                    ))}
                </div>
                <label htmlFor="seller-review-text" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                </label>
                <textarea
                    id="seller-review-text"
                    className='w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                    placeholder='Write your review about this buyer (e.g., "Very respectful and patient buyer. Great communication throughout the order process.")'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    aria-required="true"
                ></textarea>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setReviewModal(null)} 
                        className='flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        className='flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        aria-label="Submit review"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SellerReviewModal

