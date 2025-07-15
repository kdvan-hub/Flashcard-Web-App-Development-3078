import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRotateCw, FiEdit2, FiTrash2 } = FiIcons;

const FlashCard = ({ card, onEdit, onDelete, showActions = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        className="relative w-full h-64 cursor-pointer"
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg border-2 border-blue-100 flex items-center justify-center p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center">
              <div className="text-lg font-medium text-gray-800 mb-4">
                {card.front}
              </div>
              <div className="flex items-center justify-center text-blue-500 text-sm">
                <SafeIcon icon={FiRotateCw} className="w-4 h-4 mr-1" />
                Click to flip
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute inset-0 w-full h-full bg-blue-50 rounded-xl shadow-lg border-2 border-blue-200 flex items-center justify-center p-6"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="text-center">
              <div className="text-lg font-medium text-gray-800 mb-4">
                {card.back}
              </div>
              <div className="flex items-center justify-center text-blue-500 text-sm">
                <SafeIcon icon={FiRotateCw} className="w-4 h-4 mr-1" />
                Click to flip back
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => onEdit(card)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashCard;