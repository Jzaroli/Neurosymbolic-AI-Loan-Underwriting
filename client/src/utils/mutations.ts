import { gql } from '@apollo/client';

export const SUBMIT_PROFILE = gql`
  mutation submitProfile($input: InferenceInput!) {
    submitProfile(input: $input) {
      placeholder
    }  
  } 
`;