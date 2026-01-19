import getInference from '../utils/lrInference.js';

interface inferenceInputArgs {
  input: {
    age: number;
    creditScore: number;
    monthlyIncome: number;
    monthlyDebts: number;
    delinquencies30: number;
    delinquencies60: number;
    delinquencies90: number;
    openedLines: number;
    unsecuredUsage: number;
    unsecuredLimit: number;
    hasIncomeVerification: boolean;
    hasBankruptcy: boolean;
  }
}

interface inferenceResults {
    score: number;
    probability: number;
}

const resolvers = {
  Query: {
    _health: () => 'ok',
  },
  Mutation: {
    submitProfile: async (_parent: any, { input }: inferenceInputArgs): Promise<inferenceResults> => {
      // console.log(input)

      let debtRatio_calc = input.monthlyDebts / input.monthlyIncome
      let revolving_calc = input.unsecuredUsage / input.unsecuredLimit

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

      // console.log('inference_payload', inference_payload)
      const inference_results = await getInference(inference_payload)
      console.log('inference results:', inference_results)

      if (!inference_results) {
        throw new Error ('Could not fetch inference results.');
      }

      return { score: inference_results.label, probability: inference_results.probability[1] }
    },
  }
};

export default resolvers;
