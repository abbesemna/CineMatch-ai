# 🎬 QUICK START GUIDE - CineMatch AI

## ⚡ Get Started in 3 Steps

### Step 1: Open Terminal/Command Prompt
Navigate to the project folder:
```bash
cd movie-recommender-app
```

### Step 2: Install Everything
```bash
npm install
```
This will take 2-3 minutes to download all packages.

### Step 3: Start the App
```bash
npm start
```

The website will automatically open at: **http://localhost:3000**

---

## 🎯 What You'll See

1. **Loading Screen** - Movies loading from CSV (2-3 seconds)
2. **Main Page** - Browse 10,000 movies with beautiful UI
3. **Mood Buttons** - Click to filter by mood
4. **Search Bar** - Type to search movies
5. **AI Assistant Button** - Top right corner, click to chat

---

## 🤖 Using the AI Assistant

Click "AI Assistant" and try these:

- "I want something funny"
- "Recommend a good thriller"
- "What's perfect for a cozy night?"
- "I'm feeling adventurous"

The AI will analyze your request and recommend movies from your dataset!

---

## 📁 Project Structure

```
movie-recommender-app/
├── public/
│   ├── index.html              ← HTML template
│   └── movies_dataset.csv      ← YOUR 10,000 MOVIES
├── src/
│   ├── App.js                  ← Main app (all the magic happens here)
│   ├── index.js                ← Entry point
│   └── index.css               ← Styles with Tailwind
├── package.json                ← Dependencies list
├── tailwind.config.js          ← Tailwind config
└── postcss.config.js           ← PostCSS config
```

---

## ✅ Checklist

Before running `npm start`, make sure:

- [ ] Node.js is installed (v14+) - Check with: `node --version`
- [ ] You're in the `movie-recommender-app` folder
- [ ] File `movies_dataset.csv` is in the `public/` folder
- [ ] You ran `npm install` successfully

---

## 🔧 Common Issues

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org

### Issue: Movies not showing up
**Solution:** 
1. Open browser console (F12)
2. Check for errors
3. Make sure `movies_dataset.csv` is in `public/` folder
4. Refresh the page (Ctrl+R or Cmd+R)

### Issue: AI chat not working
**Solution:**
- Check your internet connection
- The AI needs network access to work
- Try refreshing the page

### Issue: Tailwind styles not applying
**Solution:**
```bash
npm install -D tailwindcss postcss autoprefixer
npm start
```

---

## 🎨 Customization Tips

### Change Theme Colors
Edit `src/App.js`, line ~143:
```javascript
className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"
```

Try:
- `from-blue-950 via-indigo-950 to-black`
- `from-green-950 via-emerald-950 to-black`
- `from-red-950 via-pink-950 to-black`

### Add More Moods
In `src/App.js`, find the `moods` array (around line ~132) and add:

```javascript
{ id: 'mysterious', label: 'Mysterious', gradient: 'from-indigo-400 to-purple-400' }
```

Then in `MOOD_TO_GENRES` (line ~11), add:
```javascript
mysterious: [9648, 53, 27] // Mystery, Thriller, Horror
```

---

## 🚀 Deploy Your Website

### Option 1: Netlify (Easiest)
1. Create account at netlify.com
2. Drag and drop the `build/` folder
3. Done! Get a free URL

### Option 2: Vercel
1. Create account at vercel.com
2. Connect your GitHub repo
3. Auto-deploy on every push

### Option 3: GitHub Pages
```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://YOURNAME.github.io/movie-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Run:
```bash
npm run deploy
```

---

## 📊 Dataset Info

Your CSV has **10,000 movies** with:
- Titles
- Descriptions (overview)
- Genres (as IDs)
- Ratings (0-10 scale)
- Vote counts
- Popularity scores
- Release dates
- Poster image paths

The app loads ALL movies and filters them in real-time!

---

## 🎓 Learning Resources

- **React Tutorial:** https://react.dev/learn
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev

---

## 💡 Pro Tips

1. **Click on any movie** to see full details in a modal
2. **Combine mood + search** for precise results
3. **AI remembers context** in the chat - have a conversation!
4. **Hover over movies** for quick info preview
5. **Filter resets** by clicking the selected mood again

---

## 🎉 You're Ready!

Run `npm start` and enjoy your AI-powered movie recommender!

Questions? Check the README.md for detailed docs.

Happy movie hunting! 🍿