'use client'

import { Star } from 'lucide-react';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const RatingModal = ({ ratingModal, setRatingModal }) => {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = async () => {
        if (rating < 0 || rating > 5) {
            return toast('Please select a rating');
        }
        if (review.length < 5) {
            return toast('write a short review');
        }

        setRatingModal(null);
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10 dark:bg-black/70 transition-colors duration-200' onClick={(e) => e.target === e.currentTarget && setRatingModal(null)}>
            <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-gray-900/50 w-96 relative transition-colors duration-200'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 dark:text-gray-100 mb-4 transition-colors duration-200'>Rate Product</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer transition-colors duration-200 ${rating > i ? "text-yellow-400 dark:text-yellow-500 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition-colors duration-200'
                    placeholder='Write your review (optional)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button onClick={e => toast.promise(handleSubmit(), { loading: 'Submitting...' })} className='w-full bg-green-500 dark:bg-green-600 text-white py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200'>
                    Submit Rating
                </button>
            </div>
        </div>
    )
}

export default RatingModal