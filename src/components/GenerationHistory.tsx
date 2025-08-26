import React from 'react';
import { History, Clock, Palette, Trash2, RotateCcw } from 'lucide-react';
import { Generation, UploadedImage } from '../types';
import { removeGeneration } from '../utils/storage';

interface GenerationHistoryProps {
  generations: Generation[];
  onRestore: (generation: Generation) => void;
  onClearHistory: () => void;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  generations,
  onRestore,
  onClearHistory
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (generations.length === 0) {
    return (
      <div className="card text-center py-12">
        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No generations yet</h3>
        <p className="text-gray-500">
          Your generated images will appear here for easy access
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Generations</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {generations.length}/5
          </span>
        </div>
        
        <button
          onClick={onClearHistory}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
          aria-label="Clear history"
        >
          Clear all
        </button>
      </div>

      {/* Generations List */}
      <div className="space-y-3">
        {generations.map((generation) => (
          <div
            key={generation.id}
            className="card hover:shadow-md transition-all duration-200 group cursor-pointer"
            onClick={() => onRestore(generation)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRestore(generation);
              }
            }}
            aria-label={`Restore generation with prompt: ${generation.prompt}`}
          >
            <div className="flex space-x-4">
              {/* Image Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={generation.imageUrl}
                  alt="Generated image"
                  className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-xl" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate mb-1">
                      {generation.prompt}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                      <Palette className="w-3 h-3" />
                      <span>{generation.style}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{formatDate(generation.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(generation);
                      }}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      aria-label="Restore this generation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGeneration(generation.id);
                        // Note: In a real app, you'd want to update the parent state
                        window.location.reload(); // Simple refresh for demo
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      aria-label="Delete this generation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          Click any generation to restore it in the main interface
        </p>
      </div>
    </div>
  );
};
