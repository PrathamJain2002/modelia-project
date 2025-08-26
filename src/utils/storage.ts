import { Generation } from '../types';

const STORAGE_KEY = 'ai_studio_generations';
const MAX_HISTORY = 5;

export const saveGeneration = (generation: Generation): void => {
  try {
    const existing = getGenerations();
    const updated = [generation, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save generation to localStorage:', error);
  }
};

export const getGenerations = (): Generation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read generations from localStorage:', error);
    return [];
  }
};

export const clearGenerations = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear generations from localStorage:', error);
  }
};

export const removeGeneration = (id: string): void => {
  try {
    const existing = getGenerations();
    const filtered = existing.filter(gen => gen.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove generation from localStorage:', error);
  }
};
