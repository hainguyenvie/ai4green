# RecyCool - Green Intelligence for Education

A Vietnamese educational platform that uses AI to turn recyclable materials into STEM learning experiences for students aged 5-14.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key

To use real AI material recognition, you need to configure your OpenAI API key:

1. Create a `.env` file in the root directory
2. Add your OpenAI API key:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**How to get an OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Create a new API key
4. Copy the key and paste it in your `.env` file

**Note:** If you don't configure the API key, the app will still work using demo data for material detection.

### 3. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- **AI Material Recognition**: Upload images of recyclable materials and get AI-powered detection
- **STEM Lesson Planning**: Automatically generate detailed lesson plans based on detected materials
- **Product Recommendations**: Get suggestions for STEM projects using your materials
- **Educational Content**: Vietnamese-language educational content for environmental awareness

## Project Structure

- `client/` - React frontend with TypeScript
- `server/` - Node.js backend
- `shared/` - Shared TypeScript schemas
- `components/` - Reusable UI components

## Technologies Used

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- OpenAI GPT-4 Vision API
- Lucide React Icons 