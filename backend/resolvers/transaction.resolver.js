import Transaction from "./../models/transaction.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("unauthorized");
        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        console.error("Error getting in transactions", error);
        throw new Error("Error getting transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("Error getting in transaction", error);
        throw new Error("Error getting transaction");
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("unauthorized");
      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};
      transactions.forEach(transaction => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });
      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        let newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("Error getting in transaction", error);
        throw new Error("Error getting transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updateTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updateTransaction;
      } catch (error) {
        console.error("Error updating in transaction", error);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deleteTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deleteTransaction;
      } catch (error) {
        console.error("Error in delete  transaction", error);
        throw new Error("Error on delete transaction");
      }
    },
  },
};
export default transactionResolver;
