import face_recognition
import cv2
import fastapi
import base64
import numpy as np
from typing import List
from pydantic import BaseModel

app = fastapi.FastAPI()
THRESHOLD = 0.7

class VerifyRequest(BaseModel):
    id_img: str
    face_img: str

@app.post("/verify_id")
async def verify_id(req: VerifyRequest):
    from_id = extract_face_from_image(readb64(req.id_img))
    from_live = extract_face_from_image(readb64(req.face_img))

    print(from_id, from_live)

    if (from_id is None or from_live is None):
        return {
            "error": "Bad Image"
        }
    
    return {
        "verified": compare_faces(from_id, from_live)
    }


def extract_face_from_image(student_img):
    # grayscale for face detection
    gray_image = cv2.cvtColor(student_img, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    detected_face = None
    # Extract face
    if len(faces) > 0:
        x, y, w, h = faces[0]
        detected_face = student_img[y:y+h, x:x+w]
    
    return detected_face

def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   return img

def compare_faces(from_id, from_live):
    # Load the known face encoding (extracted from the student ID)
    known_face_encoding = face_recognition.face_encodings(from_id)[0]  # Assuming one face is detected
    live_face_encoding = face_recognition.face_encodings(from_live)[0]
        # Compare the encodings using a distance metric (e.g., Euclidean distance)
    face_distance = face_recognition.face_distance([known_face_encoding], live_face_encoding)

    # Set a threshold for similarity (e.g., 0.6) and check if the face matches
    if face_distance[0] < THRESHOLD:
        # Face in video feed matches the student's face
        # Take appropriate actions or display the result
        return True
    return False
