
from fastapi import APIRouter

from ml_service.models.payloads import RequestPayload
from ml_service.models.prediction import PredictionResult
import numpy as np

from os import getenv
import joblib

router = APIRouter()

MODEL_PATH = getenv('MODEL_PATH', 'ml_service/sklearn_model/lr_model.joblib')

model_bundle = joblib.load(MODEL_PATH)
lr_model = model_bundle['model']
FEATURES = model_bundle['features']

# converts age to bin_mid 
def age_to_bin_mid(age: int) -> float:
    if age <= 30:
        return 25.0
    elif age <= 40:
        return 35.0
    elif age <= 50:
        return 45.0
    elif age <= 60:
        return 55.0
    elif age <= 70:
        return 65.0
    elif age <= 80:
        return 75.0
    else:
        return 95.0

# converts debtRatio to bin_mid  
def debtRatio_to_bin_mid(debtRatio: int) -> float:
    if debtRatio <= 0.25:
        return 0.125
    elif debtRatio <= 0.5:
        return 0.375
    elif debtRatio <= 0.75:
        return 0.625 
    elif debtRatio <= 1:
        return 0.875 
    elif debtRatio <= 1.25:
        return 1.125
    elif debtRatio <= 1.5:
        return 1.375
    elif debtRatio <= 1.75:
        return 1.625
    elif debtRatio <= 2:
        return 1.875
    elif debtRatio <= 2.25:
        return 2.125
    elif debtRatio <= 2.5:
        return 2.375
    elif debtRatio <= 2.75:
        return 2.625
    else:
        return 2.8755


@router.post('/predict', response_model=PredictionResult, name='predict')
def post_predict(payload: RequestPayload = None) -> PredictionResult:

    if payload is None:
        raise ValueError('Invalid payload')

    # converts age to bin_mid 
    age_bin_mid = age_to_bin_mid(payload.age)

    # converts debtRatio to bin_mid  
    debtRatio_bin_mid = debtRatio_to_bin_mid(payload.debtRatio)

    x = [[
        age_bin_mid,
        debtRatio_bin_mid,
        payload.numberOfTime30_59DaysPastDueNotWorse,
        payload.numberOfTime60_89DaysPastDueNotWorse,
        payload.numberOfTimes90DaysLate,
        np.log1p(payload.log_RevolvingUtilizationOfUnsecuredLines),
        payload.monthlyIncome,
        payload.numberOfOpenCreditLinesAndLoans
    ]]

    y = lr_model.predict(x)[0]
    prob = lr_model.predict_proba(x)[0].tolist()

    pred = PredictionResult(label=y, probability=prob)

    return pred