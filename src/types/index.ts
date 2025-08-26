export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  originalImage: {
    dataUrl: string;
    previewUrl: string;
    fileName: string;
  };
}

export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: string;
}

export interface GenerationResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  originalImage: {
    dataUrl: string;
    previewUrl: string;
    fileName: string;
  };
}

export interface ApiError {
  message: string;
}

export type StyleOption = 'Editorial' | 'Streetwear' | 'Vintage' | 'Minimalist' | 'Artistic';

export interface UploadedImage {
  file: File;
  dataUrl: string;
  previewUrl: string;
}
