
from fastapi import APIRouter

from ml.models.payloads import RequestPayload
from ml.models.prediction import PredictionResult

from os import getenv
import joblib

router = APIRouter()

MODEL_PATH = getenv('MODEL_PATH', 'ml/sklearn_model/lr_model.joblib')

model_bundle = joblib.load(MODEL_PATH)
lr_model = model_bundle['model']
FEATURES = model_bundle['features']

@router.post('/predict', response_model=PredictionResult, name='predict')
def post_predict(payload: RequestPayload = None) -> PredictionResult:

    if payload is None:
        raise ValueError('Invalid payload')

    x = [[
        payload.age_bin_mid,
        payload.DebtRatio_bin_mid,
        payload.NumberOfTime30_59DaysPastDueNotWorse,
        payload.NumberOfTime60_89DaysPastDueNotWorse,
        payload.NumberOfTimes90DaysLate,
        payload.log_RevolvingUtilizationOfUnsecuredLines,
        payload.MonthlyIncome_imputed,
        payload.NumberOfOpenCreditLinesAndLoans
    ]]

    y = lr_model.predict(x)[0]
    prob = lr_model.predict_proba(x)[0].tolist()

    pred = PredictionResult(label=y, probability=prob)

    return pred