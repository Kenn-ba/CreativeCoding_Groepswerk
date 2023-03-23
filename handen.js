const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);
  
  // Add an event listener to the body element
  document.body.addEventListener("keydown", (event) => {
    // If the "s" key is pressed, start detecting hand gestures
    if (event.code === "KeyS") {
      hands.initialize();
      hands.onResults(onHandResults);
    }
  });
  
  // Define a function to handle hand detection results
  function onHandResults(results) {
    // Get the first hand detected in the frame
    const hand = results.multiHandLandmarks[0];

    console.log(hand)
  
    // If the hand is in a swipe gesture
    if (hand && isSwiping(hand)) {
      // Navigate to the next page
      window.location.href = "anderepage.html";
    }
  }
  
  function isSwiping(hand) {
    // Get the coordinates of the thumb tip and index finger tip
    const thumbTip = hand.annotations.indexFinger[3];
    const indexTip = hand.annotations.thumb[3];
    
    // Determine the direction of the swipe based on the change in x-coordinates
    const deltaX = thumbTip[0] - indexTip[0];
    if (deltaX > 30) {
      // Swipe from left to right detected
      return true;
    } else {
      // No swipe detected
      return false;
    }
  }


const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 720,
  height: 560
});
camera.start();
