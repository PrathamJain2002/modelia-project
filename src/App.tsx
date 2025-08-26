import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Palette, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { PromptInput } from './components/PromptInput';
import { GenerateButton } from './components/GenerateButton';
import { GenerationHistory } from './components/GenerationHistory';
import { UploadedImage, Generation, StyleOption, GenerationRequest } from './types';
import { getGenerations, saveGeneration, clearGenerations } from './utils/storage';
import { apiService } from './services/api';

function App() {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | undefined>();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>('Editorial');
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | undefined>();
  const [error, setError] = useState<string>('');

  // Load generations from localStorage on mount
  useEffect(() => {
    const savedGenerations = getGenerations();
    setGenerations(savedGenerations);
  }, []);

  const handleImageSelect = (image: UploadedImage | undefined) => {
    setSelectedImage(image);
    setError('');
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    setError('');
  };

  const handleStyleChange = (newStyle: StyleOption) => {
    setSelectedStyle(newStyle);
    setError('');
  };

  const handleGenerate = (response: Generation) => {
    // Create a complete generation object with original image data
    const completeGeneration: Generation = {
      ...response,
      originalImage: {
        dataUrl: selectedImage?.dataUrl || '',
        previewUrl: selectedImage?.previewUrl || '',
        fileName: selectedImage?.file.name || 'uploaded-image'
      }
    };
    
    // Save to history
    const updatedGenerations = [completeGeneration, ...generations].slice(0, 5);
    setGenerations(updatedGenerations);
    saveGeneration(completeGeneration);
    
    // Set as current generation
    setCurrentGeneration(completeGeneration);
    setError('');
    
    // Show success message
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const handleGenerateError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleRestoreGeneration = (generation: Generation) => {
    // Restore the original uploaded image, prompt, and style
    if (generation.originalImage) {
      const restoredImage: UploadedImage = {
        file: new File([], generation.originalImage.fileName, { type: 'image/jpeg' }),
        dataUrl: generation.originalImage.dataUrl,
        previewUrl: generation.originalImage.previewUrl
      };
      setSelectedImage(restoredImage);
    } else {
      setSelectedImage(undefined);
    }
    
    setPrompt(generation.prompt);
    setSelectedStyle(generation.style as StyleOption);
    setCurrentGeneration(generation); // Show the generation result
    setError('');
  };

  const handleClearHistory = () => {
    clearGenerations();
    setGenerations([]);
  };

  const handleCreateNew = () => {
    // Reset everything to default state
    setSelectedImage(undefined);
    setPrompt('');
    setSelectedStyle('Editorial');
    setCurrentGeneration(undefined);
    setError('');
    
    // Show success message
    const successMessage = 'Workspace reset successfully! Ready for new creation.';
    setError(successMessage);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const canGenerate = selectedImage && prompt.trim().length > 0;

  const generationRequest: GenerationRequest = {
    imageDataUrl: selectedImage?.dataUrl || '',
    prompt: prompt.trim(),
    style: selectedStyle
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Modelia AI Studio</h1>
                <p className="text-sm text-gray-500">Transform your images with AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Powered by AI</span>
              </div>
              
              {(selectedImage || prompt || currentGeneration) && (
                <button
                  onClick={handleCreateNew}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create New</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Interface */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Upload Section */}
            <section className="card">
              <div className="flex items-center space-x-2 mb-6">
                <ImageIcon className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Upload Image</h2>
              </div>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
            </section>

            {/* Prompt & Style Section */}
            <section className="card">
              <div className="flex items-center space-x-2 mb-6">
                <Palette className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Style & Prompt</h2>
              </div>
              <PromptInput
                prompt={prompt}
                onPromptChange={handlePromptChange}
                selectedStyle={selectedStyle}
                onStyleChange={handleStyleChange}
                selectedImage={selectedImage}
              />
            </section>

            {/* Generate Section */}
            <section className="card">
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Generate</h2>
              </div>
              <GenerateButton
                request={generationRequest}
                onSuccess={handleGenerate}
                onError={handleGenerateError}
                disabled={!canGenerate}
              />
            </section>

            {/* Error Display */}
            {error && (
              <div className="card bg-red-50 border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Current Generation Result */}
            {currentGeneration && (
              <section className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-900">Generated Result</h2>
                </div>
                
                <div className="space-y-4">
                  <img
                    src={currentGeneration.imageUrl}
                    alt="Generated image"
                    className="w-full max-h-96 object-cover rounded-xl border border-green-200"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-green-800">Prompt:</span>
                      <p className="text-sm text-green-700 mt-1">{currentGeneration.prompt}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-800">Style:</span>
                      <p className="text-sm text-green-700 mt-1">{currentGeneration.style}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-green-600 bg-green-100 px-3 py-2 rounded-lg">
                    ✅ Generation completed successfully! This image has been saved to your history.
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleCreateNew}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Create New</span>
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <section className="card">
              <GenerationHistory
                generations={generations}
                onRestore={handleRestoreGeneration}
                onClearHistory={handleClearHistory}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Built with React, TypeScript, and TailwindCSS</p>
            <p className="mt-1">Modelia AI Studio - Frontend Engineer Assignment</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
