import face_recognition
import cv2
import fastapi

app = fastapi.FastAPI()


@app.post("/verify_id")
async def verify_id():
    return True


def extract_face_from_image():
    id_image = cv2.imread("student_id.jpg")

    # grayscale for face detection
    gray_image = cv2.cvtColor(id_image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Extract face
    if len(faces) > 0:
        x, y, w, h = faces[0]
        detected_face = id_image[y:y+h, x:x+w]

import base64

def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   return img

def extract_face_from_video():
    frame = readb64(uri);

    while True:
        
        id_image = frame
        # grayscale for face detection
        gray_image = cv2.cvtColor(id_image, cv2.COLOR_BGR2GRAY)

        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(
            gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) > 0:
            x, y, w, h = faces[0]
            detected_face = id_image[y:y+h, x:x+w]

        cv2.imshow("Video Feed", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


def compare_both_id_and_video():
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
