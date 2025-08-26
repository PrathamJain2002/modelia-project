import React, { useState } from 'react';
import { Play, Loader2, X, RefreshCw } from 'lucide-react';
import { GenerationRequest, GenerationResponse } from '../types';
import { apiService } from '../services/api';

interface GenerateButtonProps {
  request: GenerationRequest;
  onSuccess: (response: GenerationResponse) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  request,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setRetryCount(0);
    
    try {
      const response = await apiService.generateImage(request);
      onSuccess(response);
      setRetryCount(0);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Request aborted') {
          onError('Generation was cancelled');
        } else {
          onError(error.message);
        }
      } else {
        onError('An unexpected error occurred');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAbort = () => {
    apiService.abortRequest();
    setIsGenerating(false);
    setRetryCount(0);
  };

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      const response = await apiService.generateImage(request);
      onSuccess(response);
      setRetryCount(0);
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('Retry failed');
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const isDisabled = disabled || isGenerating || isRetrying;

  return (
    <div className="space-y-4">
      {/* Main Generate Button */}
      <div className="flex space-x-3">
        {!isGenerating ? (
          <button
            onClick={handleGenerate}
            disabled={isDisabled}
            className={`btn-primary flex-1 flex items-center justify-center space-x-2 ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play className="w-5 h-5" />
            <span>Generate Image</span>
          </button>
        ) : (
          <button
            onClick={handleAbort}
            className="btn-secondary flex-1 flex items-center justify-center space-x-2"
          >
            <X className="w-5 h-5" />
            <span>Cancel Generation</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div className="flex-1">
              <p className="text-blue-900 font-medium">Generating your image...</p>
              <p className="text-blue-700 text-sm">
                This usually takes 1-2 seconds. Please wait.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Retry State */}
      {retryCount > 0 && !isGenerating && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-900 font-medium">
                Generation failed (Attempt {retryCount}/3)
              </span>
            </div>
            <p className="text-yellow-700 text-sm">
              The AI model was overloaded. We'll automatically retry with exponential backoff.
            </p>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="btn-secondary text-sm py-2 px-4"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                'Retry Now'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {isGenerating && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};
