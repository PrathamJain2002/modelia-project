import { GenerationRequest, GenerationResponse, ApiError } from '../types';

class ApiService {
  private baseUrl = 'https://api.modelia.ai'; // Mock URL
  private abortController: AbortController | null = null;

  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    // Cancel any previous request
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    
    return this.generateWithRetry(request, 0);
  }

  private async generateWithRetry(
    request: GenerationRequest, 
    attempt: number
  ): Promise<GenerationResponse> {
    try {
      const response = await this.makeRequest(request, attempt);
      
      // Simulate 20% error rate
      if (Math.random() < 0.2) {
        throw new Error('Model overloaded');
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.message === 'Model overloaded' && attempt < 2) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.generateWithRetry(request, attempt + 1);
      }
      throw error;
    }
  }

  private async makeRequest(
    request: GenerationRequest, 
    attempt: number
  ): Promise<GenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Check if request was aborted
    if (this.abortController?.signal.aborted) {
      throw new Error('Request aborted');
    }

    // Mock response
    const response: GenerationResponse = {
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: this.generateMockImageUrl(request.style),
      prompt: request.prompt,
      style: request.style,
      createdAt: new Date().toISOString()
    };

    return response;
  }

  private generateMockImageUrl(style: string): string {
    // Generate a mock image URL based on style
    const styleColors = {
      'Editorial': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      'Streetwear': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      'Vintage': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
      'Minimalist': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'Artistic': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'
    };
    
    return styleColors[style as keyof typeof styleColors] || styleColors['Editorial'];
  }

  abortRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  isRequestInProgress(): boolean {
    return this.abortController !== null && !this.abortController.signal.aborted;
  }
}

export const apiService = new ApiService();
