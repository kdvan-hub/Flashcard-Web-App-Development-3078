import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBookOpen, FiEdit2, FiTrash2, FiLayers } = FiIcons;

const SetCard = ({ set, cardCount, onSelect, onEdit, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(set)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <SafeIcon icon={FiLayers} className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{set.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <SafeIcon icon={FiBookOpen} className="w-4 h-4" />
              {cardCount} {cardCount === 1 ? 'card' : 'cards'}
            </div>
          </div>
        </div>
      </div>

      {set.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {set.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Created {new Date(set.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(set);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(set.id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SetCard;