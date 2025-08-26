import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GenerateButton } from '../GenerateButton';
import { vi } from 'vitest';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    generateImage: vi.fn(),
    abortRequest: vi.fn(),
    isRequestInProgress: vi.fn()
  }
}));

describe('GenerateButton Component', () => {
  const mockRequest = {
    imageDataUrl: 'data:image/jpeg;base64,test',
    prompt: 'Test prompt',
    style: 'Editorial'
  };

  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders generate button when not generating', () => {
    render(
      <GenerateButton
        request={mockRequest}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        disabled={false}
      />
    );
    
    expect(screen.getByText('Generate Image')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows cancel button when generating', () => {
    render(
      <GenerateButton
        request={mockRequest}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        disabled={false}
      />
    );
    
    // Simulate generation start
    const generateButton = screen.getByText('Generate Image');
    fireEvent.click(generateButton);
    
    // Should show cancel button
    expect(screen.getByText('Cancel Generation')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <GenerateButton
        request={mockRequest}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        disabled={true}
      />
    );
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state during generation', () => {
    render(
      <GenerateButton
        request={mockRequest}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        disabled={false}
      />
    );
    
    const generateButton = screen.getByText('Generate Image');
    fireEvent.click(generateButton);
    
    expect(screen.getByText('Generating your image...')).toBeInTheDocument();
    expect(screen.getByText('This usually takes 1-2 seconds. Please wait.')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(
      <GenerateButton
        request={mockRequest}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        disabled={false}
      />
    );
    
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveFocus();
  });
});
