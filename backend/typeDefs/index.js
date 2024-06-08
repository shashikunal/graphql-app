import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";

const mergedTypeDef = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedTypeDef;
