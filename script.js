const video = document.createElement('video');
video.id = 'video';
video.width = 640;
video.height = 480;
document.getElementById('videoContainer').appendChild(video);

let goodPostureSaved = false;
let goodPostureImg;

// Access the webcam and start video stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    console.error("Error accessing webcam:", err);
  });

function savePosture() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas image to grayscale
  const img = cv.imread(canvas);
  goodPostureImg = new cv.Mat();
  cv.cvtColor(img, goodPostureImg, cv.COLOR_BGR2GRAY);

  goodPostureSaved = true;
  img.delete();

  console.log("Good posture saved.");
}

function detectPostureChange() {
  if (!goodPostureSaved) {
    console.error("Please save the good posture first.");
    return;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas image to grayscale using OpenCV
  const img = cv.imread(canvas);
  const grayImg = new cv.Mat();
  cv.cvtColor(img, grayImg, cv.COLOR_BGR2GRAY);

  // Compare the grayscale data with the good posture image
  const diff = new cv.Mat();
  cv.absdiff(grayImg, goodPostureImg, diff);

  // Some basic thresholding to detect changes
  const threshold = 50;
  const mask = new cv.Mat();
  cv.threshold(diff, mask, threshold, 255, cv.THRESH_BINARY);

  // Count the non-zero pixels in the mask (posture change area)
  const numPixelsChanged = cv.countNonZero(mask);

  // Determine if the posture has changed significantly
  const pixelThreshold = 10000;

  if (numPixelsChanged > pixelThreshold) {
    alert("Posture changed! Check yo' self!");
  }
  
  img.delete();
  grayImg.delete();
  diff.delete();
  mask.delete();
}

// Call detectPostureChange every 500 milliseconds to check posture
setInterval(detectPostureChange, 500);
