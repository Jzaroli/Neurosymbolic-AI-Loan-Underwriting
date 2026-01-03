const typeDefs = `

input InferenceInput {
  age: Int!, 
  creditScore: Int!, 
  monthlyIncome: Float!, 
  monthlyDebts: Float!, 
  delinquencies30: Int!, 
  delinquencies60: Int!, 
  delinquencies90: Int!, 
  openedLines: Int!, 
  unsecuredUsage: Float!, 
  unsecuredLimit: Float, 
  hasIncomeVerification: Boolean!, 
  hasBankruptcy: Boolean!
}

type InferenceResponse {
  placeholder: Int!
}

type Query {
  _health: String
}

type Mutation {
    submitProfile(input: InferenceInput!): InferenceResponse!
}

`;

export default typeDefs;
