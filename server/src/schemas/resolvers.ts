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
    hasBankruptcy: boolean
  }
}

interface inferenceResults {
    placeholder: number;
}

const resolvers = {

Query: {
    _health: () => 'ok',
  },
Mutation: {
    submitProfile: async (_parent: any, { input }: inferenceInputArgs): Promise<inferenceResults> => {
      console.log(input);

      return { placeholder: 1 };
    },
  }
};

export default resolvers;
