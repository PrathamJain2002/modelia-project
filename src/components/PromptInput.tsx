import React from 'react';
import { Sparkles, Palette } from 'lucide-react';
import { StyleOption, UploadedImage } from '../types';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  selectedStyle: StyleOption;
  onStyleChange: (style: StyleOption) => void;
  selectedImage?: UploadedImage;
}

const styleOptions: StyleOption[] = ['Editorial', 'Streetwear', 'Vintage', 'Minimalist', 'Artistic'];

const styleDescriptions: Record<StyleOption, string> = {
  'Editorial': 'Professional, magazine-style photography',
  'Streetwear': 'Urban, fashion-forward aesthetic',
  'Vintage': 'Classic, retro-inspired look',
  'Minimalist': 'Clean, simple, uncluttered design',
  'Artistic': 'Creative, expressive, artistic interpretation'
};

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  selectedStyle,
  onStyleChange,
  selectedImage
}) => {
  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-3">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Describe your vision</span>
          </div>
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the style, mood, or transformation you want to apply to your image..."
          className="input-field min-h-[100px] resize-none"
          rows={4}
        />
        <p className="text-sm text-gray-500">
          Be specific about colors, lighting, mood, and artistic direction
        </p>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <label htmlFor="style" className="block text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-primary-600" />
            <span>Choose a style</span>
          </div>
        </label>
        <select
          id="style"
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value as StyleOption)}
          className="dropdown"
        >
          {styleOptions.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500">
          {styleDescriptions[selectedStyle]}
        </p>
      </div>

      {/* Live Summary Preview */}
      {selectedImage && prompt && (
        <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Live Preview</span>
          </h3>
          
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={selectedImage.previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl border border-primary-200"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                {selectedStyle}
              </div>
            </div>
            
            {/* Prompt & Style Summary */}
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-primary-800">Prompt:</span>
                <p className="text-sm text-primary-700 mt-1">{prompt}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-primary-800">Style:</span>
                <p className="text-sm text-primary-700 mt-1">{selectedStyle}</p>
              </div>
            </div>
            
            <div className="text-xs text-primary-600 bg-primary-100 px-3 py-2 rounded-lg">
              ✨ This preview shows how your image will be processed with the selected style and prompt
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
