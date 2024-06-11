import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query getAuthenticatedUser {
    authUser {
      _id
      username
      name
      profilePicture
    }
  }
`;

export const GET_USER_AND_TRANSACTIONS = gql`
  query getUserAndTransactions($userId: ID!) {
    user(userId: $userId) {
      _id
      name
      username
      profilePicture
      #relationShips
      transactions {
        _id
        description
        paymentType
        category
        amount
        location
        date
      }
    }
  }
`;
