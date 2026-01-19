import axios from 'axios';

export default async function getInference (payload: any){
    const url = process.env.ML_SERVICE_URL;
    
    if (!url) {
        throw new Error('ML_SERVICE_URL is not defined');
    }

    try {
        const request = await axios.post(
            url,
            {
                'age': payload.age,
                'debtRatio': payload.debtRatio,
                'numberOfTime30_59DaysPastDueNotWorse': payload.numberOfTime30_59,
                'numberOfTime60_89DaysPastDueNotWorse': payload.numberOfTime60_89,
                'numberOfTimes90DaysLate': payload.numberOfTimes90,
                'log_RevolvingUtilizationOfUnsecuredLines': payload.revolvingUtilizationOfUnsecuredLines,
                'monthlyIncome': payload.monthlyIncome,
                'numberOfOpenCreditLinesAndLoans': payload.numberOfOpenCreditLinesAndLoans
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        return request.data ?? {};

    } catch (err:any) {
        console.error('ML Inference Error', err.response?.data || err.message)
    };
};
