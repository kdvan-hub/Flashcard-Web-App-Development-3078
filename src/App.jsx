import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from './common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createCard, createSet } from './utils/cardUtils';
import FlashCard from './components/FlashCard';
import CardForm from './components/CardForm';
import SetForm from './components/SetForm';
import SetCard from './components/SetCard';
import StudyMode from './components/StudyMode';

const { FiPlus, FiBookOpen, FiLayers, FiSearch, FiHome } = FiIcons;

function App() {
  const [cards, setCards] = useLocalStorage('flashcards', []);
  const [sets, setSets] = useLocalStorage('flashcard-sets', []);
  const [currentView, setCurrentView] = useState('sets'); // 'sets', 'cards', 'study'
  const [selectedSet, setSelectedSet] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showSetForm, setShowSetForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editingSet, setEditingSet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get cards for current set
  const getCurrentCards = () => {
    if (!selectedSet) return [];
    return cards.filter(card => card.setId === selectedSet.id);
  };

  // Get card count for a set
  const getSetCardCount = (setId) => {
    return cards.filter(card => card.setId === setId).length;
  };

  // Filter sets based on search
  const getFilteredSets = () => {
    if (!searchTerm) return sets;
    return sets.filter(set => 
      set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (set.description && set.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Handle card operations
  const handleSaveCard = (cardData) => {
    if (editingCard) {
      setCards(prev => prev.map(card => 
        card.id === editingCard.id 
          ? { ...card, ...cardData }
          : card
      ));
    } else {
      const newCard = createCard(cardData.front, cardData.back, cardData.setId);
      setCards(prev => [...prev, newCard]);
    }
    setShowCardForm(false);
    setEditingCard(null);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowCardForm(true);
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setCards(prev => prev.filter(card => card.id !== cardId));
    }
  };

  const handleUpdateCard = (updatedCard) => {
    setCards(prev => prev.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  // Handle set operations
  const handleSaveSet = (setData) => {
    if (editingSet) {
      setSets(prev => prev.map(set => 
        set.id === editingSet.id 
          ? { ...set, ...setData }
          : set
      ));
    } else {
      const newSet = createSet(setData.name, setData.description);
      setSets(prev => [...prev, newSet]);
    }
    setShowSetForm(false);
    setEditingSet(null);
  };

  const handleEditSet = (set) => {
    setEditingSet(set);
    setShowSetForm(true);
  };

  const handleDeleteSet = (setId) => {
    const cardCount = getSetCardCount(setId);
    const message = cardCount > 0 
      ? `Are you sure you want to delete this set? This will also delete ${cardCount} card${cardCount === 1 ? '' : 's'}.`
      : 'Are you sure you want to delete this set?';
    
    if (window.confirm(message)) {
      setSets(prev => prev.filter(set => set.id !== setId));
      setCards(prev => prev.filter(card => card.setId !== setId));
      if (selectedSet && selectedSet.id === setId) {
        setSelectedSet(null);
        setCurrentView('sets');
      }
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentView('cards');
  };

  const handleStartStudy = () => {
    if (getCurrentCards().length > 0) {
      setCurrentView('study');
    }
  };

  // Render views
  const renderSetsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Flashcard Sets</h1>
          <p className="text-gray-600">Organize your cards into study sets</p>
        </div>
        <button
          onClick={() => setShowSetForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          New Set
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search sets..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Sets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getFilteredSets().map(set => (
          <SetCard
            key={set.id}
            set={set}
            cardCount={getSetCardCount(set.id)}
            onSelect={handleSelectSet}
            onEdit={handleEditSet}
            onDelete={handleDeleteSet}
          />
        ))}
      </div>

      {getFilteredSets().length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiLayers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No sets found matching your search.' : 'No flashcard sets yet.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowSetForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Create Your First Set
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderCardsView = () => {
    const currentCards = getCurrentCards();
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentView('sets')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2"
            >
              <SafeIcon icon={FiHome} className="w-4 h-4" />
              Back to Sets
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{selectedSet?.name}</h1>
            <p className="text-gray-600">{currentCards.length} cards</p>
          </div>
          <div className="flex gap-2">
            {currentCards.length > 0 && (
              <button
                onClick={handleStartStudy}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiBookOpen} className="w-4 h-4" />
                Study
              </button>
            )}
            <button
              onClick={() => setShowCardForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Add Card
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentCards.map(card => (
            <FlashCard
              key={card.id}
              card={card}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
            />
          ))}
        </div>

        {currentCards.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiBookOpen} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No cards in this set yet.</p>
            <button
              onClick={() => setShowCardForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Add Your First Card
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentView === 'sets' && (
            <motion.div
              key="sets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderSetsView()}
            </motion.div>
          )}

          {currentView === 'cards' && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderCardsView()}
            </motion.div>
          )}

          {currentView === 'study' && (
            <StudyMode
              key="study"
              cards={getCurrentCards()}
              setName={selectedSet?.name || 'Study Session'}
              onBack={() => setCurrentView('cards')}
              onUpdateCard={handleUpdateCard}
            />
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showSetForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowSetForm(false);
                setEditingSet(null);
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <SetForm
                  set={editingSet}
                  onSave={handleSaveSet}
                  onCancel={() => {
                    setShowSetForm(false);
                    setEditingSet(null);
                  }}
                />
              </div>
            </motion.div>
          )}

          {showCardForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowCardForm(false);
                setEditingCard(null);
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <CardForm
                  card={editingCard}
                  sets={sets}
                  selectedSetId={selectedSet?.id}
                  onSave={handleSaveCard}
                  onCancel={() => {
                    setShowCardForm(false);
                    setEditingCard(null);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;