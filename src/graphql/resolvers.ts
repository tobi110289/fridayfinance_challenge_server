import { PrismaClient, Account, Category, Transaction } from "@prisma/client";
import {
  CategoryInput,
  TransactionInput,
  TransactionQueryInput,
} from "../../src/generated/types";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export default {
  Transaction: {
    category: async (parent: Transaction): Promise<Category | null> => {
      try {
        return parent.category_id
          ? await prisma.category.findUnique({
              where: { id: parent.category_id },
            })
          : null;
      } catch (error) {
        throw error;
      }
    },
    account: async (parent: Transaction): Promise<Account | null> => {
      try {
        return await prisma.account.findUnique({
          where: { id: parent.account_id },
        });
      } catch (error) {
        throw error;
      }
    },
  },
  Query: {
    getAccounts: async (): Promise<Account[]> => {
      try {
        return await prisma.account.findMany();
      } catch (error) {
        throw error;
      }
    },
    getCategories: async (): Promise<Category[]> => {
      try {
        return await prisma.category.findMany();
      } catch (error) {
        throw error;
      }
    },
    getTransactions: async (
      _: unknown,
      args: TransactionQueryInput
    ): Promise<Transaction[]> => {
      try {
        const {
          id,
          first,
          after,
          bank,
          account,
          reference,
          category,
          amount,
          startDate,
          endDate,
        } = args;
        let where: any = {};

        if (id) Object.assign(where, { id: { equals: id } });
        if (bank)
          Object.assign(where, {
            Account: { bank: { contains: bank, mode: "insensitive" } },
          });
        if (account)
          Object.assign(where, {
            Account: {
              ...where.Account,
              name: { contains: account, mode: "insensitive" },
            },
          });
        if (reference)
          Object.assign(where, {
            reference: { contains: reference, mode: "insensitive" },
          });
        if (category)
          Object.assign(where, {
            Category: { name: { contains: category, mode: "insensitive" } },
          });
        if (amount) Object.assign(where, { amount: { equals: amount } });
        if (startDate) Object.assign(where, { date: { gte: startDate } });
        if (endDate)
          Object.assign(where, { date: { ...where.date, lte: endDate } });

        return await prisma.transaction.findMany({
          where,
          take: first || 100,
          skip: after || 0,
        });
      } catch (error) {
        console.error(error);
        throw new Error("Could not fetch transactions");
      }
    },
    getUniqueCategories: async (): Promise<Transaction[]> => {
      try {
        return await prisma.transaction.findMany({
          where: {},
          distinct: ["category_id"],
        });
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    updateTransactionCategory: async (
      _: unknown,
      args: { data: TransactionInput }
    ): Promise<Transaction> => {
      try {
        return await prisma.transaction.update({
          where: { id: args.data.id },
          data: { category_id: args.data.category_id },
        });
      } catch (error) {
        throw error;
      }
    },
    createCategory: async (
      _: unknown,
      args: { data: CategoryInput }
    ): Promise<Category> => {
      try {
        const uuid = uuidv4();
        const newCategory = await prisma.category.create({
          data: { id: uuid, ...args.data },
        });
        return newCategory;
      } catch (error) {
        throw error;
      }
    },
  },
};
