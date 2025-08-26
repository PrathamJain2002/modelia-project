# 🎨 Modelia AI Studio

A modern, responsive React web application that simulates an AI-powered image transformation studio. Built with TypeScript, TailwindCSS, and modern React patterns.

## ✨ Features

### 🖼️ Image Upload & Processing
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **File Validation**: PNG/JPG support with 10MB size limit
- **Automatic Downscaling**: Client-side image processing to ≤1920px when needed
- **Preview System**: Real-time image preview with file information

### 🎭 Style & Prompt System
- **5 Style Options**: Editorial, Streetwear, Vintage, Minimalist, Artistic
- **Live Preview**: Real-time summary showing image + prompt + style combination
- **Smart Descriptions**: Helpful descriptions for each style option

### 🚀 AI Generation (Mock API)
- **Realistic Simulation**: 1-2 second generation time with loading states
- **Error Handling**: 20% simulated error rate with automatic retry
- **Exponential Backoff**: Smart retry logic (max 3 attempts)
- **Request Abort**: Cancel in-flight generations at any time

### 📚 Generation History
- **Local Storage**: Persists last 5 generations across sessions
- **Quick Restore**: Click any history item to restore it in the main interface
- **Smart Formatting**: Relative timestamps and file information
- **Management**: Clear individual items or entire history

### ♿ Accessibility Features
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **ARIA Labels**: Proper screen reader support
- **Focus Management**: Logical tab order and focus indicators
- **High Contrast**: Accessible color schemes and contrast ratios

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage persistence
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient system (#0ea5e9 to #0369a1)
- **Neutral**: Gray scale (#f9fafb to #111827)
- **Semantic**: Success (green), Warning (yellow), Error (red)

### Typography
- **Font**: Inter (system fallback)
- **Hierarchy**: Clear heading levels with consistent spacing
- **Readability**: Optimized line heights and contrast

### Components
- **Cards**: Consistent rounded corners (2xl) with subtle shadows
- **Buttons**: Interactive states with hover effects and transitions
- **Forms**: Accessible inputs with focus states and validation
- **Layout**: Responsive grid system with proper spacing

### Animations
- **Micro-interactions**: Hover effects, focus states, loading animations
- **Transitions**: Smooth 200ms transitions for all interactive elements
- **Loading States**: Spinners, progress bars, and skeleton screens

## 🏗️ Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── ImageUpload.tsx     # Image upload with drag & drop
│   ├── PromptInput.tsx     # Prompt and style selection
│   ├── GenerateButton.tsx  # Generation with retry logic
│   └── GenerationHistory.tsx # History management
├── services/           # Business logic and API
│   └── api.ts             # Mock API service
├── types/             # TypeScript interfaces
│   └── index.ts           # All type definitions
├── utils/             # Utility functions
│   ├── imageUtils.ts      # Image processing utilities
│   └── storage.ts         # LocalStorage management
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

### State Management
- **Local State**: React hooks for component-level state
- **Persistence**: localStorage for generation history
- **Data Flow**: Unidirectional data flow with clear interfaces

### Error Handling
- **Validation**: Client-side validation with user-friendly messages
- **API Errors**: Graceful error handling with retry mechanisms
- **Fallbacks**: Empty states and loading indicators

## 🧪 Testing Strategy

### Unit Tests (Implemented)
- Component rendering and interactions
- Utility function logic
- API service mocking
- State management flows
- Accessibility testing

### Integration Tests (Planned)
- User workflow scenarios
- Data persistence
- Error handling flows

### E2E Tests (Planned)
- Complete user journeys
- Cross-browser compatibility
- Accessibility testing

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm to lg)
- **Desktop**: > 1024px (lg+)

### Layout Adaptations
- **Mobile**: Single column layout with stacked sections
- **Tablet**: Optimized spacing and touch targets
- **Desktop**: Two-column layout with sidebar history

## ♿ Accessibility Features

### Keyboard Navigation
- Tab order follows visual layout
- Enter/Space for button activation
- Escape for modal dismissal

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Proper heading hierarchy

### Visual Accessibility
- High contrast color schemes
- Clear focus indicators
- Consistent interactive elements

## 🚀 Performance Optimizations

### Image Processing
- Client-side downscaling to reduce upload size
- Efficient canvas operations
- Memory management for large files

### React Optimizations
- Memoized callbacks with useCallback
- Efficient re-renders with proper dependencies
- Lazy loading for non-critical components

### Bundle Optimization
- Tree shaking for unused code
- Efficient imports and exports
- Optimized asset loading

## 🔮 Future Enhancements

### Planned Features
- **Real API Integration**: Connect to actual AI services
- **Advanced Image Editing**: Pre-processing tools and filters
- **User Accounts**: Authentication and cloud storage
- **Collaboration**: Sharing and team features

### Technical Improvements
- **PWA Support**: ✅ Basic PWA manifest and meta tags implemented
- **Performance Monitoring**: Real user metrics and optimization
- **Internationalization**: Multi-language support
- **Advanced Testing**: ✅ Unit tests implemented, integration tests planned

## 📄 License

This project is created for the Modelia Frontend Engineer assignment. All rights reserved.

## 🤝 Contributing

This is a demonstration project for a job application. For questions or feedback, please contact the development team.

---

**Built with ❤️ using modern web technologies**
