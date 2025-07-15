import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import FlashCard from './FlashCard';

const { FiArrowLeft, FiChevronLeft, FiChevronRight, FiShuffle, FiRefreshCw } = FiIcons;

const StudyMode = ({ cards, setName, onBack, onUpdateCard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyCards, setStudyCards] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    setStudyCards([...cards]);
  }, [cards]);

  const shuffleCards = () => {
    const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
    setCurrentIndex(0);
    setIsShuffled(true);
  };

  const resetOrder = () => {
    setStudyCards([...cards]);
    setCurrentIndex(0);
    setIsShuffled(false);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % studyCards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + studyCards.length) % studyCards.length);
  };

  const markAsStudied = () => {
    const card = studyCards[currentIndex];
    const updatedCard = {
      ...card,
      lastStudied: new Date().toISOString(),
      studyCount: (card.studyCount || 0) + 1
    };
    onUpdateCard(updatedCard);
  };

  if (studyCards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No cards to study in this set.</p>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              Back to Sets
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = studyCards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <h2 className="font-semibold text-gray-800">{setName}</h2>
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {studyCards.length}
            </p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / studyCards.length) * 100}%` }}
          ></div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <FlashCard 
              card={currentCard} 
              showActions={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevCard}
            disabled={studyCards.length <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={FiChevronLeft} className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={markAsStudied}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark Studied
          </button>

          <button
            onClick={nextCard}
            disabled={studyCards.length <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <SafeIcon icon={FiChevronRight} className="w-4 h-4" />
          </button>
        </div>

        {/* Study Options */}
        <div className="flex gap-2 justify-center">
          {!isShuffled ? (
            <button
              onClick={shuffleCards}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <SafeIcon icon={FiShuffle} className="w-4 h-4" />
              Shuffle
            </button>
          ) : (
            <button
              onClick={resetOrder}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              Reset Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyMode;