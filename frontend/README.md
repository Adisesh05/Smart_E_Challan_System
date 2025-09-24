# Traffic Violation Analysis System

A comprehensive React + TypeScript + Tailwind web application for analyzing traffic violations from video footage with multi-language support and strong accessibility features.

## Features

### Core Functionality
- **Authentication System**: Secure login/register with JWT tokens
- **Video Analysis**: Upload and analyze traffic violation videos
- **Challan Management**: View, search, and sort traffic challans
- **Real-time Results**: Display violation details, vehicle info, and challan amounts

### Internationalization (i18n)
- Support for 12 major Indian languages:
  - English, Hindi, Bengali, Telugu, Marathi, Tamil
  - Gujarati, Kannada, Malayalam, Odia, Punjabi, Urdu
- Native script display for all languages
- RTL support for Urdu
- Persistent language selection

### Accessibility (WCAG 2.2 AA Compliant)
- **Keyboard Navigation**: Full keyboard support with focus management
- **Screen Reader Support**: ARIA labels, roles, and live regions
- **Visual Accessibility**: High contrast mode, font size controls
- **Focus Management**: Skip links, focus traps, and visible focus indicators
- **Semantic HTML**: Proper landmarks, headings, and structure

### Theme & Customization
- **Dark/Light Mode**: System preference detection with manual override
- **Font Size Control**: Three levels (small, normal, large)
- **High Contrast Mode**: Enhanced visibility for users with visual impairments
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
\`\`\`

## API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Bootstrap
- `POST /bootstrap/violation-types` - Initialize violation types

### Analysis
- `POST /process/analyze` - Analyze video file (multipart form data)

### Challans
- `GET /challans?plate=<optional>` - Get challans with optional plate filter

## Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
└── middleware.ts         # Route protection
\`\`\`

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons and links
- Arrow keys for table navigation
- Escape to close modals/dropdowns

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Proper heading hierarchy

### Visual Accessibility
- High contrast mode toggle
- Font size adjustment (3 levels)
- Focus indicators on all interactive elements
- Color contrast ratios meet WCAG AA standards

### Testing
All interactive elements include `data-testid` attributes for automated testing:
- `email-input`, `password-input` - Form inputs
- `login-button`, `register-button` - Authentication buttons
- `upload-button`, `analyze-button` - File upload and analysis
- `search-input` - Challan search

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style and patterns
2. Ensure all new features are accessible (WCAG 2.2 AA)
3. Add appropriate ARIA labels and roles
4. Test with keyboard navigation and screen readers
5. Include proper TypeScript types
6. Add data-testid attributes for testing

## License

MIT License - see LICENSE file for details
