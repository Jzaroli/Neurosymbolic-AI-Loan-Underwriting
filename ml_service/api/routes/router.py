from fastapi import APIRouter
from ml_service.api.routes import prediction

api = APIRouter()

api.include_router(prediction.router, tags=['prediction'])