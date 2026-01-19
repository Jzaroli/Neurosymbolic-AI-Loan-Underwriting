from pydantic import BaseModel

class RequestPayload(BaseModel):
    age: float
    debtRatio: float
    numberOfTime30_59DaysPastDueNotWorse: int
    numberOfTime60_89DaysPastDueNotWorse: int
    numberOfTimes90DaysLate: int
    log_RevolvingUtilizationOfUnsecuredLines: float
    monthlyIncome: float
    numberOfOpenCreditLinesAndLoans: int
