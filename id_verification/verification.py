import face_recognition
import cv2
import fastapi
import base64
import numpy as np
from typing import List
from pydantic import BaseModel
from fastapi.responses import HTMLResponse

app = fastapi.FastAPI()
THRESHOLD = 0.5

tester_html = open("api_tester.html").read()

@app.get("/tester")
async def tester():
    return HTMLResponse(content=tester_html, status_code=200)

class VerifyRequest(BaseModel):
    id_img: str
    face_img: str

@app.post("/verify_id")
async def verify_id(req: VerifyRequest):
    id_img = readb64(req.id_img)
    live_img = readb64(req.face_img)

    id_face = extract_face_from_image(id_img)
    live_face = extract_face_from_image(live_img)

    if (id_face is None or live_face is None):
        return {
            "error": "Bad Image(s)"
        }

    # Determine the target size for scaling (e.g., 100x100 pixels)
    target_size = (200, 200)

    id_to_scale = np.array(id_face, dtype='uint8')
    live_to_scale = np.array(live_face, dtype='uint8')
    # Resize both cropped images to the target size
    scaled_id = cv2.resize(id_to_scale, target_size)
    scaled_live = cv2.resize(live_to_scale, target_size)

    result = compare_faces(scaled_id, scaled_live)
    return {
        "verified": result
    }


def extract_face_from_image(student_img):
    # Convert the image to grayscale for face detection
    gray_image = cv2.cvtColor(student_img, cv2.COLOR_BGR2GRAY)

    # Load the face cascade classifier
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect faces in the grayscale image
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # If you want to extract and return the first detected face:
    if len(faces) >= 1:
        x, y, w, h = faces[0]
        extracted_face = gray_image[y:y + h, x:x + w]
        return cv2.cvtColor(extracted_face, cv2.COLOR_GRAY2BGR)

def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   return img

def compare_faces(from_id, from_live):
    # Load the known face encoding (extracted from the student ID)
    known_face_encodings = face_recognition.face_encodings(from_id)
    live_face_encoding = face_recognition.face_encodings(from_live)[0]

    results = face_recognition.compare_faces(known_face_encodings, live_face_encoding, tolerance=0.45)
    print(results)
    return bool(results[0])
