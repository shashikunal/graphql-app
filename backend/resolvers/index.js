import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from "./user.resolver.js";
import transactionResolver from "./transaction.resolver.js";

const mergedResolvers = mergeResolvers([userResolvers, transactionResolver]);

export default mergedResolvers;
