# CineMatch AI - Movie Recommendation Website

AI-powered movie recommendation system that suggests films based on your mood using Claude AI.

## Features

- 🎬 **10,000+ Movies** from your dataset
- 🤖 **AI Chat Assistant** powered by Claude for personalized recommendations
- 🎭 **8 Mood Categories** for quick filtering
- 🔍 **Smart Search** across titles and descriptions
- ⭐ **Ratings & Reviews** from the dataset
- 🎨 **Beautiful Dark UI** with smooth animations
- 📱 **Responsive Design** works on all devices

## Project Structure

```
movie-recommender-app/
├── public/
│   ├── index.html              # HTML template
│   └── movies_dataset.csv      # Your movie dataset (10,000 movies)
├── src/
│   ├── App.js                  # Main React component
│   ├── index.js                # React entry point
│   └── index.css               # Tailwind CSS + custom styles
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This will install:
- React 18
- React Scripts
- Lucide React (for icons)
- Tailwind CSS (via PostCSS)

### Step 2: Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Step 3: Create PostCSS Config

Create a file named `postcss.config.js` in the root directory:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 4: Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## How to Use

1. **Browse Movies**: Scroll through the trending movies or use search
2. **Select Mood**: Click on mood buttons to filter movies by genre
3. **AI Assistant**: Click "AI Assistant" to chat and get personalized recommendations
4. **View Details**: Click any movie card to see full information

## AI Assistant

The AI chat uses Claude's API to:
- Understand your mood and preferences
- Recommend specific movies from the dataset
- Explain why movies match your taste
- Answer questions about films

Example prompts:
- "I want something funny tonight"
- "Recommend a thriller"
- "What's good for a date night?"
- "I'm feeling adventurous"

## Customization

### Change Color Theme

Edit `src/App.js` and modify the gradient classes:
- Current: `from-slate-950 via-purple-950 to-slate-900`
- Try: `from-blue-950 via-indigo-950 to-slate-900`

### Add More Moods

In `src/App.js`, find the `moods` array and add:

```javascript
{ id: 'energetic', label: 'Energetic', gradient: 'from-orange-400 to-red-400' }
```

Then add to `MOOD_TO_GENRES`:

```javascript
energetic: [28, 12, 878] // Action, Adventure, Sci-Fi
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Deployment

### Deploy to Netlify/Vercel:

1. Push code to GitHub
2. Connect your repository
3. Build command: `npm run build`
4. Publish directory: `build`

### Deploy to GitHub Pages:

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:

```json
"homepage": "https://yourusername.github.io/movie-recommender",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Run:
```bash
npm run deploy
```

## Troubleshooting

### Movies not loading?
- Check browser console for errors
- Ensure `movies_dataset.csv` is in `public/` folder
- Clear browser cache and reload

### AI not responding?
- Check internet connection
- The AI uses Anthropic's API which requires network access
- Check browser console for API errors

### Styling issues?
- Run `npm install` to ensure Tailwind is installed
- Check that `postcss.config.js` exists
- Clear cache and restart dev server

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Claude AI** - Movie recommendations
- **TMDB API** - Movie posters (via image URLs in dataset)

## Dataset Format

The CSV should have these columns:
- `title` - Movie title
- `overview` - Description
- `genre_ids` - Array of genre IDs
- `vote_average` - Rating (0-10)
- `vote_count` - Number of votes
- `popularity` - Popularity score
- `release_date` - Release date
- `poster_path` - Poster image path

## License

MIT License - Feel free to use and modify!

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all dependencies are installed

Enjoy discovering amazing movies! 🎬🍿