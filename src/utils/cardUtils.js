export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createCard = (front, back, setId = 'default') => ({
  id: generateId(),
  front: front.trim(),
  back: back.trim(),
  setId,
  createdAt: new Date().toISOString(),
  lastStudied: null,
  studyCount: 0
});

export const createSet = (name, description = '') => ({
  id: generateId(),
  name: name.trim(),
  description: description.trim(),
  createdAt: new Date().toISOString(),
  cardCount: 0
});

export const validateCard = (front, back) => {
  const errors = {};
  if (!front.trim()) errors.front = 'Front side is required';
  if (!back.trim()) errors.back = 'Back side is required';
  return errors;
};

export const validateSet = (name) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Set name is required';
  return errors;
};