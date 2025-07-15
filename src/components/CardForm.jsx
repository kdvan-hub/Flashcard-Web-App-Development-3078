import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { validateCard } from '../utils/cardUtils';

const { FiX, FiSave } = FiIcons;

const CardForm = ({ card, onSave, onCancel, sets, selectedSetId }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [setId, setSetId] = useState(selectedSetId || 'default');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
      setSetId(card.setId);
    } else {
      setFront('');
      setBack('');
      setSetId(selectedSetId || 'default');
    }
  }, [card, selectedSetId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCard(front, back);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      front: front.trim(),
      back: back.trim(),
      setId
    });

    if (!card) {
      setFront('');
      setBack('');
      setErrors({});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {card ? 'Edit Card' : 'Add New Card'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <SafeIcon icon={FiX} className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Set
          </label>
          <select
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Default Set</option>
            {sets.map(set => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Front (Question)
          </label>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.front ? 'border-red-300' : 'border-gray-300'
            }`}
            rows="3"
            placeholder="Enter the question or term..."
          />
          {errors.front && (
            <p className="text-red-500 text-sm mt-1">{errors.front}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Back (Answer)
          </label>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.back ? 'border-red-300' : 'border-gray-300'
            }`}
            rows="3"
            placeholder="Enter the answer or definition..."
          />
          {errors.back && (
            <p className="text-red-500 text-sm mt-1">{errors.back}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            {card ? 'Update' : 'Save'} Card
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CardForm;