const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));

// Read high scores from the file
const highScoresPath = path.join(__dirname, 'highScores.json');
let highScores = [];

fs.readFile(highScoresPath, 'utf8', (err, data) => {
  if (!err) {
    try {
      highScores = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing high scores file:', error);
    }
  }
});

// Save high scores to the file
function saveHighScores() {
  fs.writeFile(highScoresPath, JSON.stringify(highScores), 'utf8', (err) => {
    if (err) {
      console.error('Error saving high scores file:', err);
    }
  });
}

app.get('/high-scores', (req, res) => {
  res.json(highScores);
});

app.post('/high-scores', express.json(), (req, res) => {
  const newScore = req.body.score;

  if (typeof newScore === 'number') {
    highScores.push(newScore);
    highScores.sort((a, b) => a - b);
    highScores = highScores.slice(0, 5); // Keep only the top 5 scores

    // Save the updated high scores to the file
    saveHighScores();

    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid score format' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});