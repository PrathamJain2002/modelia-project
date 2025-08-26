import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from '../ImageUpload';
import { vi } from 'vitest';

// Mock the image utilities
vi.mock('../../utils/imageUtils', () => ({
  validateImage: vi.fn(),
  downscaleImage: vi.fn(),
  formatFileSize: vi.fn()
}));

describe('ImageUpload Component', () => {
  const mockOnImageSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload interface when no image is selected', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} />);
    
    expect(screen.getByText('Upload an image')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop or click to browse')).toBeInTheDocument();
    expect(screen.getByText('PNG, JPG up to 10MB')).toBeInTheDocument();
  });

  it('shows selected image when image is provided', () => {
    const mockImage = {
      file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      dataUrl: 'data:image/jpeg;base64,test',
      previewUrl: 'blob:test'
    };

    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={mockImage} />);
    
    expect(screen.getByAltText('Selected image preview')).toBeInTheDocument();
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });

  it('calls onImageSelect when remove button is clicked', () => {
    const mockImage = {
      file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      dataUrl: 'data:image/jpeg;base64,test',
      previewUrl: 'blob:test'
    };

    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={mockImage} />);
    
    const removeButton = screen.getByLabelText('Remove image');
    fireEvent.click(removeButton);
    
    expect(mockOnImageSelect).toHaveBeenCalledWith(undefined);
  });

  it('handles file input change', async () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} />);
    
    const fileInput = screen.getByLabelText('Upload image');
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Note: In a real test, you'd mock the image processing utilities
    // and verify the onImageSelect call with the processed image
  });

  it('is keyboard accessible', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} />);
    
    const uploadArea = screen.getByLabelText('Upload image');
    expect(uploadArea).toHaveAttribute('tabIndex', '0');
    
    // Test keyboard navigation
    uploadArea.focus();
    expect(uploadArea).toHaveFocus();
  });
});
