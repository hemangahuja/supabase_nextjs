import fastapi

app = fastapi.FastAPI()


@app.post("/verify_id")
async def verify_id():
    return True