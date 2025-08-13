# DocQA Engine Frontend

A modern, responsive React frontend for the DocQA Engine - an AI-powered document question answering system.

## Features

- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📁 **Drag & Drop Upload** - Easy document upload with visual feedback
- 💬 **Real-time Chat** - Interactive Q&A interface
- 🔍 **Source Tracking** - See which documents were used for answers
- ⚡ **Fast & Responsive** - Smooth animations and transitions
- 📱 **Mobile Friendly** - Works great on all devices

## Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Fetch API** - Modern HTTP requests

## Setup

### Prerequisites

- Node.js 16+ 
- Your DocQA backend running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
   ```bash
   cd qa-frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

1. **Upload Documents:**
   - Drag and drop files or click to browse
   - Supports TXT, PDF, DOCX files (max 10MB each)
   - Multiple files can be uploaded at once

2. **Ask Questions:**
   - Type your question in the chat input
   - Press Enter or click Send
   - Get AI-powered answers based on your documents

3. **View Sources:**
   - Each answer shows which documents were used
   - Click on source files to see more details

## API Integration

The frontend connects to your DocQA backend endpoints:

- `POST /upload` - Upload documents
- `POST /ask` - Ask questions and get AI answers

## Development

### Project Structure

```
qa-frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── index.js        # React entry point
│   └── index.css       # Global styles and Tailwind
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

### Customization

- **Colors:** Modify `tailwind.config.js` for custom color schemes
- **Styling:** Update `src/index.css` for custom component styles
- **Icons:** Replace Lucide icons with your preferred icon set

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

## Troubleshooting

### Common Issues

1. **Backend not running:**
   - Make sure your DocQA backend is running on port 8000
   - Check the proxy setting in `package.json`

2. **CORS errors:**
   - Ensure your backend allows requests from `http://localhost:3000`

3. **Upload failures:**
   - Check file size limits (10MB per file)
   - Verify file types are supported (TXT, PDF, DOCX)

## Contributing

Feel free to submit issues and enhancement requests!
