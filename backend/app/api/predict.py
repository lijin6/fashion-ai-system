from fastapi import APIRouter, UploadFile, File
from app.services.inference_service import run_inference
from app.schemas.prediction import PredictionResponse

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    results = run_inference(contents)
    print(results)
    return {"results": results}
