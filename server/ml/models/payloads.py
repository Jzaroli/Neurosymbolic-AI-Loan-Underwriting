from pydantic import BaseModel

class RequestPayload(BaseModel):
    age_bin_mid: float
    DebtRatio_bin_mid: float
    NumberOfTime30_59DaysPastDueNotWorse: int
    NumberOfTime60_89DaysPastDueNotWorse: int
    NumberOfTimes90DaysLate: int
    log_RevolvingUtilizationOfUnsecuredLines: float
    MonthlyIncome_imputed: float
    NumberOfOpenCreditLinesAndLoans: int
