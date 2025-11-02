# Regex Palace

A comprehensive regular expression testing and debugging tool built with React, TypeScript, and Tailwind CSS.

## Features

- **AI-Powered Regex Generation**: Describe what you want to match in plain English and let AI create the perfect regex pattern
- **Query Formula Genie**: Generate database queries (MySQL, PostgreSQL, SQL Server, Oracle) and spreadsheet formulas (Excel, Google Sheets) using regex or substring matching
- **Real-time Regex Testing**: Test regular expressions against sample text with instant feedback
- **Match Highlighting**: Visual highlighting of matched patterns in the test string
- **Code Generation**: Generate regex code snippets for JavaScript, Python, Java, C#, and Go
- **Railroad Diagrams**: Visual representation of regex patterns using railroad syntax diagrams
- **Find & Replace**: Test regex-based find and replace operations with preview
- **String Splitting**: Split strings using regex patterns with detailed results
- **Match Analysis**: Detailed breakdown of matches including position, groups, and filters
- **Import/Export**: Save and share regex patterns with file import/export functionality
- **Compact Shareable Links**: Generate short shareable URLs (20-40 characters) with compressed state encoding
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/regex-palace.git
cd regex-palace
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── RegexInput.tsx  # Pattern input component
│   ├── RegexResults.tsx # Results display component
│   ├── RegexReplace.tsx # Find & replace component
│   ├── CodeGeneration.tsx # Code generation component
│   └── ...             # Other components
├── utils/              # Utility functions
│   ├── regex.ts        # Regex validation and execution
│   └── codegen.ts      # Code generation utilities
├── types/              # TypeScript type definitions
├── pages/              # Page components
└── hooks/              # Custom React hooks
```

## Adding Google Ads

To integrate Google AdSense ads into the application:

### 1. AdSense Setup

1. Apply for Google AdSense and get approved
2. Create ad units in your AdSense dashboard
3. Copy the ad unit codes

### 2. Add AdSense Script

Add the AdSense script to your `index.html` file in the `<head>` section:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" 
        crossorigin="anonymous"></script>
```

Replace `ca-pub-XXXXXXXXXX` with your actual AdSense publisher ID.

### 3. Replace Ad Placeholders

The application includes ad placeholder components in `src/components/AdPlaceholders.tsx`. Replace these placeholders with actual AdSense ad units:

```tsx
// Example ad unit replacement
<div className="ad-container">
  <ins className="adsbygoogle"
       style={{display: 'block'}}
       data-ad-client="ca-pub-XXXXXXXXXX"
       data-ad-slot="YYYYYYYYYY"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### 4. Ad Placement Locations

The application has designated ad spaces:

- **Header Ad**: Top banner (728x90 leaderboard)
- **Sidebar Ad**: Right sidebar (300x250 medium rectangle)
- **Bottom Ad**: Footer area (728x90 leaderboard)
- **Floating Ad**: Fixed position ad (300x250)
- **Content Ad**: Between sections (728x90)

### 5. Environment Variables

For different ad configurations across environments, you can use environment variables:

```bash
# .env.local
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
VITE_ADSENSE_SLOT_HEADER=1234567890
VITE_ADSENSE_SLOT_SIDEBAR=0987654321
```

Note: Vite environment variables must be prefixed with `VITE_`.

## Technologies Used

- **React 18**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and development server
- **shadcn/ui**: Component library
- **Lucide React**: Icon library
- **Railroad Diagrams**: Regex visualization
- **React Router**: Client-side routing

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, questions, or feature requests, please open an issue on GitHub.

## Deployment

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Firebase Hosting**: Deploy using Firebase CLI

## Performance Optimization

- Code splitting is automatically handled by Vite
- Components are lazily loaded where appropriate
- Railroad diagram library is dynamically imported
- Images and assets are optimized during build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## SEO Features

- Semantic HTML structure
- Meta tags for social sharing
- Structured data markup
- Optimized loading performance
- Mobile-responsive design