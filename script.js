let soundFile;
let probability = 0.5;
let selectedMouseButton = 'left';
let gameInterval;
let gameStartTime;
let highScores = [];

document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('probabilityInput').addEventListener('input', handleProbabilityChange);
document.getElementById('mouseButtonSelect').addEventListener('change', handleMouseButtonChange);
document.getElementById('startButton').addEventListener('click', startGame);

function handleFileSelect(event) {
  const fileInput = event.target;
  soundFile = fileInput.files[0];
}

function handleProbabilityChange(event) {
  probability = parseFloat(event.target.value);
}

function handleMouseButtonChange(event) {
  selectedMouseButton = event.target.value;
}

function startGame() {
  if (!soundFile || isNaN(probability) || !selectedMouseButton) {
    console.log('Debug: Sound File:', soundFile);
    console.log('Debug: Probability:', probability);
    console.log('Debug: Selected Mouse Button:', selectedMouseButton);

    alert('Please select a sound file, probability, and mouse button.');
    return;
  }

  // Hide the settings container
  document.getElementById('settings').style.display = 'none';

  // Show the game area container
  document.getElementById('gameArea').style.display = 'block';

  // Reset previous game data
  clearInterval(gameInterval);
  highScores = [];

  // Start the game loop and store the interval ID
  gameInterval = setInterval(playSound, 1000 / probability);
  gameStartTime = new Date().getTime();
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
  
    // Save the final high scores locally
    saveLocalHighScores();
  
    // Reset high scores and current reaction time
    highScores = [];
    displayHighScores();
    displayReactionTime(0); // Assuming you have a function to display reaction time
  
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

  let userClickedInTime = true; // Initialize to true to handle the first sound

  function playSound() {
    // Reset the variable for each new sound
    userClickedInTime = false;
  
    const randomNumber = Math.random();
  
    // Play the sound based on probability
    if (randomNumber <= probability) {
      const audio = new Audio(URL.createObjectURL(soundFile));
  
      // Set the volume
      audio.volume = audioVolume;
  
      // Set the start time when the sound is played
      const soundStartTime = new Date().getTime();
  
      audio.play();
  
      // Record the time when the user clicks
      const recordReactionTime = () => {
        // Check if the user clicked in time
        if (!userClickedInTime) {
          // Display "FAILED" if the user didn't click in time
          displayReactionTime('FAILED');
        }
      };
  
      // Add a click event listener for the selected mouse button
      document.addEventListener(selectedMouseButton === 'left' ? 'click' : 'contextmenu', recordReactionTime, { once: true });
    }
  
    // Set a timeout to handle the case where the user didn't click in time
    setTimeout(() => {
      if (!userClickedInTime) {
        // Display "FAILED" if the user didn't click in time
        displayReactionTime('FAILED');
      }
    }, 1000 / probability);
  }
  
  function displayReactionTime(reactionTime) {
    const reactionTimeDisplay = document.getElementById('reactionTimeDisplay');
  
    if (reactionTime === 'FAILED') {
      reactionTimeDisplay.textContent = 'Your Reaction Time: FAILED';
    } else {
      reactionTimeDisplay.textContent = `Your Reaction Time: ${reactionTime} milliseconds`;
    }
  
    // Update the variable to track whether the user clicked in time
    userClickedInTime = reactionTime !== 'FAILED';
  
    // If the user clicked in time, update the high scores
    if (userClickedInTime && reactionTime !== 'FAILED') {
      highScores.push(reactionTime);
      highScores.sort((a, b) => a - b);
      highScores = highScores.slice(0, 10); // Keep only the top 10 scores
  
      // Save the updated high scores locally
      saveLocalHighScores();
  
      // Update the high scores display
      displayHighScores();
    }
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
