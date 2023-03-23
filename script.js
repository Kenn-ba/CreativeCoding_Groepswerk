// Get the video element with ID 'video'
const video = document.getElementById('video');

// Load the required models from the faceapi library
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Face detection model
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Face landmarks model
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Face recognition model
  faceapi.nets.faceExpressionNet.loadFromUri('/models') // Facial expression recognition model
]).then(startVideo); // Call the startVideo function after the models have been loaded successfully

// Function to start the video stream
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream, // Set the video stream as the source for the video element
    err => console.error(err)
  )
}

function getDominantEmotion(expressions) {
  const entries = Object.entries(expressions); // Convert the expressions object into an array of [key, value] pairs
  entries.sort((a, b) => b[1] - a[1]); // Sort the array in descending order of value
  const [dominantEmotion] = entries[0]; // Get the key of the first (i.e. dominant) emotion
  return dominantEmotion; // Return the dominant emotion
}

// Event listener to detect when the video starts playing
video.addEventListener('play', () => {

  // Create a canvas element from the video element
  const canvas = faceapi.createCanvasFromMedia(video);
  // Append the canvas element to the document body

  const h1 = document.createElement('h1'); // Create a new h1 element
  document.body.append(h1); // Append the h1 element to the document body
  // Set the display size of the canvas to be the same as the video

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize); // Match the dimensions of the canvas to the display size
  
  const emotionToNavigate = 'happy';
  
  setInterval(async () => {

    // Detect all faces in the video stream, with face landmarks and facial expressions
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    
    // Resize the detected faces to fit the display size
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // Clear the canvas before drawing new detections
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    
    // Draw the facial expressions on the canvas
    const expressions = resizedDetections[0].expressions; // Get the expressions of the first detected face
    const emotion = getDominantEmotion(expressions); // Call a function to get the dominant emotion
    h1.innerText = `Emotion: ${emotion}`; // Set the text of the h1 element to show the dominant emotion

    if (emotion === emotionToNavigate) {
      window.location.href = 'anderepage.html'; // Change this to the URL of the page you want to navigate to
    }
    
  }, 100) // Repeat the detection every 100 milliseconds
});