import face_recognition
import cv2
import fastapi
import base64
from typing import List

app = fastapi.FastAPI()
THRESHOLD = 0.7

@app.post("/verify_id")
async def verify_id(id_img: str, face_img: str):
    from_id = extract_face_from_image(readb64(id_img))
    from_live = extract_face_from_image(readb64(face_img))

    if (not from_id or not from_live):
        return {
            "error": "Bad Image"
        }
    
    return compare_faces(from_id, from_live)


def extract_face_from_image(student_img):
    id_image = cv2.imread(student_img)
    # grayscale for face detection
    gray_image = cv2.cvtColor(id_image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    detected_face = None
    # Extract face
    if len(faces) > 0:
        x, y, w, h = faces[0]
        detected_face = id_image[y:y+h, x:x+w]
    
    return detected_face

def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   return img

def compare_faces(from_id, from_live):
    # Load the known face encoding (extracted from the student ID)
    known_face_encoding = face_recognition.face_encodings(
        detected_face)[0]  # Assuming one face is detected

    # Encode the faces in the video frames
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    # Compare the face encoding from the student ID with the face encodings from the video frames
    for encoding in face_encodings:
        # Compare the encodings using a distance metric (e.g., Euclidean distance)
        face_distance = face_recognition.face_distance(
            [known_face_encoding], encoding)

        # Set a threshold for similarity (e.g., 0.6) and check if the face matches
        if face_distance[0] < 0.6:
            # Face in video feed matches the student's face
            # Take appropriate actions or display the result
            print("Match found")
