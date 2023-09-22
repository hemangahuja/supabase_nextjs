const express = require('express');
const cv = require('opencv4nodejs');
const base64Img = require('base64-img');
const faceapi = require('face-api.js');
const app = express();
const THRESHOLD = 0.6;

// Load face-api.js models
const { canvas, faceDetectionNet, faceDetectionOptions } = require('face-api.js');
faceapi.env.monkeyPatch({ canvas });

// Set up express middleware for JSON parsing
app.use(express.json());

class VerifyRequest {
  constructor(id_img, face_img) {
    this.id_img = id_img;
    this.face_img = face_img;
  }
}

app.post('/verify_id', async (req, res) => {
  const { id_img, face_img } = req.body;

  const idBuffer = Buffer.from(id_img, 'base64');
  const liveBuffer = Buffer.from(face_img, 'base64');

  const id_bounds = await extractFaceFromImage(idBuffer);
  const live_bounds = await extractFaceFromImage(liveBuffer);

  if (!id_bounds || !live_bounds) {
    return res.json({ error: 'Bad Image(s)' });
  }

  const verified = await compareFaces(idBuffer, id_bounds, liveBuffer, live_bounds);

  res.json({ verified });
});

async function extractFaceFromImage(student_img) {
  const img = cv.imdecode(student_img);
  const grayImg = img.cvtColor(cv.COLOR_BGR2GRAY);
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

  const faceRects = classifier.detectMultiScale(grayImg, faceDetectionOptions);

  if (faceRects.length >= 1) {
    const [x, y, w, h] = faceRects[0].rect;
    const extractedFace = img.getRegion(new cv.Rect(x, y, w, h)).copy();
    return extractedFace;
  }

  return null;
}

async function compareFaces(from_id, id_bounds, from_live, live_bounds) {
  // Load face-api.js models
  await faceDetectionNet.loadFromDisk('./models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

  // Convert Buffer to ArrayBuffer
  const idBufferArray = new Uint8Array(from_id.buffer);
  const liveBufferArray = new Uint8Array(from_live.buffer);

  // Load image using face-api.js
  const idImage = await canvas.loadImage(Buffer.from(idBufferArray));
  const liveImage = await canvas.loadImage(Buffer.from(liveBufferArray));

  // Detect faces
  const idFaces = await faceapi.detectAllFaces(idImage, faceDetectionOptions).withFaceLandmarks().withFaceDescriptors();
  const liveFaces = await faceapi.detectAllFaces(liveImage, faceDetectionOptions).withFaceLandmarks().withFaceDescriptors();

  // Assuming there's only one face in each image
  const knownFaceDescriptor = idFaces[0].descriptor;
  const liveFaceDescriptor = liveFaces[0].descriptor;

  // Calculate face distance
  const faceDistance = faceapi.euclideanDistance(knownFaceDescriptor, liveFaceDescriptor);

  // Set a threshold for similarity (e.g., 0.6) and check if the face matches
  if (faceDistance < THRESHOLD) {
    // Face in video feed matches the student's face
    // Take appropriate actions or display the result
    return true;
  }

  return false;
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
