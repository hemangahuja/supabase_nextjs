import face_recognition
import cv2
import fastapi
import base64
import numpy as np
from typing import List
from pydantic import BaseModel

app = fastapi.FastAPI()
THRESHOLD = 0.6

class VerifyRequest(BaseModel):
    id_img: str
    face_img: str

@app.post("/verify_id")
async def verify_id(req: VerifyRequest):
    id_img = readb64(req.id_img)
    live_img = readb64(req.face_img)

    id_bounds = extract_face_from_image(id_img)
    live_bounds = extract_face_from_image(live_img)

    if (id_bounds is None or live_bounds is None):
        return {
            "error": "Bad Image(s)"
        }
    
    return {
        "verified": compare_faces(id_img, id_bounds, live_img, live_bounds)
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

    # Iterate through the detected faces and draw rectangles around them
    (x, y, w, h) = faces[0]

    # If you want to extract and return the first detected face:
    if len(faces) >= 1:
        first_face = faces[0]
        x, y, w, h = first_face
        extracted_face = student_img[y:y + h, x:x + w]
        return extracted_face

def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   print(type(img))
   return img

def compare_faces(from_id, id_bounds, from_live, live_bounds):
    # Load the known face encoding (extracted from the student ID)
    known_face_encoding = face_recognition.face_encodings(from_id, known_face_locations=[id_bounds])  # Assuming one face is detected
    live_face_encoding = face_recognition.face_encodings(from_live, known_face_locations=[live_bounds])

    face_distance = face_recognition.face_distance([known_face_encoding], live_face_encoding)

    # Set a threshold for similarity (e.g., 0.6) and check if the face matches
    if face_distance[0] < THRESHOLD:
        # Face in video feed matches the student's face
        # Take appropriate actions or display the result
        return True
    return False
