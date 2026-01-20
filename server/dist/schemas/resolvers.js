import getInference from '../utils/lrInference.js';
const resolvers = {
    Query: {
        _health: () => 'ok',
    },
    Mutation: {
        submitProfile: async (_parent, { input }) => {
            // validates that all inputs are numbers
            if (isNaN(input.age) || isNaN(input.creditScore) || isNaN(input.monthlyIncome) || isNaN(input.monthlyDebts) || isNaN(input.delinquencies30) || isNaN(input.delinquencies60) || isNaN(input.delinquencies90) || isNaN(input.openedLines) || isNaN(input.unsecuredUsage) || isNaN(input.unsecuredLimit)) {
                throw new Error('Inputs must all be numbers.');
            }
            // validates correct age range
            if (input.age < 18 || input.age > 120) {
                throw new Error('Applicant must be between the ages of 18 and 120.');
            }
            // validates correct credit score range
            if (input.creditScore < 300 || input.creditScore > 850) {
                throw new Error('Applicant credit score must be between 300 and 850.');
            }
            // validates monthly income
            if (input.monthlyIncome < 0 || input.monthlyIncome > 1000000) {
                throw new Error('Applicant monthly income must be between $0 and $1,000,000');
            }
            // validates monthly debt
            if (input.monthlyDebts < 0 || input.monthlyDebts > 1000000) {
                throw new Error('Applicant monthly debt must be between $0 and $1,000,000');
            }
            // validates unsecured limit
            if (input.unsecuredLimit < 0 || input.unsecuredLimit > 1000000) {
                throw new Error('Applicant unsecured limit must be between $0 and $1,000,000');
            }
            // validates unsecured usage
            if (input.unsecuredUsage < 0 || input.unsecuredUsage > 1000000) {
                throw new Error('Applicant unsecured usage must be between $0 and $1,000,000');
            }
            // validates numberOfTime30_59
            if (input.delinquencies30 < 0 || input.delinquencies30 > 30) {
                throw new Error('Applicant number of times delinquent 30-59 days must be between 0 and 30');
            }
            // validates numberOfTime60_89
            if (input.delinquencies60 < 0 || input.delinquencies60 > 30) {
                throw new Error('Applicant number of times delinquent 60-89 days must be between 0 and 30');
            }
            // validates numberOfTime90
            if (input.delinquencies90 < 0 || input.delinquencies90 > 30) {
                throw new Error('Applicant number of times delinquent 90+ days must be between 0 and 30');
            }
            // validates number of open credit lines and loans
            if (input.openedLines < 0 || input.openedLines > 50) {
                throw new Error('Applicant number of open credit lines and loans must be between 0 and 50');
            }
            let debtRatio_calc = input.monthlyDebts / input.monthlyIncome;
            let revolving_calc = input.unsecuredUsage / input.unsecuredLimit;
            const inference_payload = {
                age: input.age,
                debtRatio: debtRatio_calc,
                numberOfTime30_59: input.delinquencies30,
                numberOfTime60_89: input.delinquencies60,
                numberOfTimes90: input.delinquencies90,
                revolvingUtilizationOfUnsecuredLines: revolving_calc,
                monthlyIncome: input.monthlyIncome,
                numberOfOpenCreditLinesAndLoans: input.openedLines,
            };
            const inference_results = await getInference(inference_payload);
            console.log('inference results:', inference_results);
            if (!inference_results) {
                throw new Error('Could not fetch inference results.');
            }
            return { score: inference_results.label, probability: inference_results.probability[1] };
        },
    }
};
export default resolvers;
