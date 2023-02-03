import { PrismaClient, Account, Category, Transaction } from '@prisma/client';
import { CategoryInput, TransactionInput } from '../../src/generated/types';
import { v4 as uuidv4 } from 'uuid';




const prisma = new PrismaClient();

export default {
    Query: {
        getAccounts: async (): Promise<Account[]> => await prisma.account.findMany(),
        getCategories: async (): Promise<Category[]> => await prisma.category.findMany(),
        getTransactions: async (): Promise<Transaction[]> => await prisma.transaction.findMany(),
    },
    Mutation: {
        updateTransactionCategory: async (_: unknown, args: { data: TransactionInput }): Promise<Transaction> => {
            return await prisma.transaction.update({
                where: { id: args.data.id },
                data: { category_id: args.data.id },
            });
        },
        createCategory: async (_: unknown, args: { data: CategoryInput }): Promise<Category> => {
            try {
                const uuid = uuidv4();
                const newCategory = await prisma.category.create({
                    data: { id: uuid, ...args.data }
                });
                return newCategory;
            } catch (error) {
                throw error;
            }
        },
    },
};
