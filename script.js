let soundFile;
let probability = 0.5;
let selectedMouseButton = 'left';
let gameInterval;
let gameStartTime;
let highScores = [];

document.getElementById('probabilityInput').addEventListener('input', handleProbabilityChange);
document.getElementById('mouseButtonSelect').addEventListener('change', handleMouseButtonChange);
document.getElementById('startButton').addEventListener('click', startGame);

document.getElementById('soundFileSelect').addEventListener('change', handleSoundFileChange);
document.getElementById('soundFileInput').addEventListener('change', handleSoundFileUpload);

function handleSoundFileChange(event) {
  const selectedFile = event.target.value;
  if (selectedFile) {
    soundFile = selectedFile;
  }
}

function handleSoundFileUpload(event) {
  const uploadedFile = event.target.files[0];
  if (uploadedFile) {
    soundFile = uploadedFile;
  }
}

function handleProbabilityChange(event) {
  probability = parseFloat(event.target.value);
}

function handleMouseButtonChange(event) {
  selectedMouseButton = event.target.value;
}

function startGame() {
  if (!soundFile || isNaN(probability)) {
    alert('Please select a sound file and probability.');
    return;
  }

  // Hide the settings container
  document.getElementById('settings').style.display = 'none';

  // Show the game area container
  document.getElementById('gameArea').style.display = 'block';

  // Reset previous game data
  clearInterval(gameInterval);
  highScores = [];

  // Start the game loop
  gameInterval = setInterval(playSound, 1000 / probability);
  gameStartTime = new Date().getTime();
}

function displayHighScores() {
    // Fetch high scores from the server
    fetch('/high-scores')
      .then(response => response.json())
      .then(data => {
        // Update the high scores
        highScores = data;
        
        // Sort high scores in ascending order
        highScores.sort((a, b) => a - b);
  
        // Display the top 5 high scores
        const highScoreList = document.getElementById('highScoreList');
        highScoreList.innerHTML = '<h3>High Scores</h3>';
        for (let i = 0; i < Math.min(5, highScores.length); i++) {
          const listItem = document.createElement('li');
          listItem.textContent = `${i + 1}. ${highScores[i]} milliseconds`;
          highScoreList.appendChild(listItem);
        }
      })
      .catch(error => console.error('Error fetching high scores:', error));
  }

  document.addEventListener('contextmenu', function (event) {
    if (selectedMouseButton === 'right') {
      event.preventDefault();
    }
  });

  document.getElementById('stopButton').addEventListener('click', stopGame);

  function stopGame() {
    // Clear the game loop interval
    clearInterval(gameInterval);
  
    // Show the settings container
    document.getElementById('settings').style.display = 'block';
  
    // Hide the game area container
    document.getElementById('gameArea').style.display = 'none';
  }
  

  let audioVolume = 0.5; // Initial volume

  document.getElementById('volumeInput').addEventListener('input', handleVolumeChange);
  
  function handleVolumeChange(event) {
    audioVolume = parseFloat(event.target.value)/100;
  }

  function playSound() {
    const randomNumber = Math.random();
  
    // Play the sound based on probability
    if (randomNumber <= probability) {
      const audio = new Audio(soundFile instanceof File ? URL.createObjectURL(soundFile) : soundFile);
  
      // Set the volume
      audio.volume = audioVolume;
  
      // Set the start time when the sound is played
      const soundStartTime = new Date().getTime();
  
      audio.play();
  
      // Record the time when the user clicks
      const recordReactionTime = () => {
        const reactionTime = new Date().getTime() - soundStartTime;
  
        // Update the UI with the most recent reaction time
        displayReactionTime(reactionTime);
  
        // Update the high scores
        highScores.push(reactionTime);
        displayHighScores();
      };
  
      // Add a click event listener for the selected mouse button
      document.addEventListener(selectedMouseButton === 'left' ? 'click' : 'contextmenu', recordReactionTime, { once: true });
    }
  }
  
  function displayReactionTime(reactionTime) {
    const reactionTimeDisplay = document.getElementById('reactionTimeDisplay');
    reactionTimeDisplay.textContent = `Your Reaction Time: ${reactionTime} milliseconds`;
  }

function displayHighScores() {
  // Sort high scores in ascending order
  highScores.sort((a, b) => a - b);

  // Display the top 5 high scores
  const highScoreList = document.getElementById('highScoreList');
  highScoreList.innerHTML = '<h3>High Scores</h3>';
  for (let i = 0; i < Math.min(10, highScores.length); i++) {
    const listItem = document.createElement('li');
    listItem.textContent = `${i + 1}. ${highScores[i]} milliseconds`;
    highScoreList.appendChild(listItem);
  }
}