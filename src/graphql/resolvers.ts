import { PrismaClient, Account, Category, Transaction } from '@prisma/client';
import { CategoryInput, TransactionInput, TransactionQueryInput } from '../../src/generated/types';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default {
    Transaction: {
        category: async (parent: Transaction): Promise<Category | null> => {
            return parent.category_id ? await prisma.category.findUnique({ where: { id: parent.category_id } }) : null;
        },
        account: async (parent: Transaction): Promise<Account | null> => {
            return await prisma.account.findUnique({ where: { id: parent.account_id } });
        }
    },
    Query: {
        getAccounts: async (): Promise<Account[]> => await prisma.account.findMany(),
        getCategories: async (): Promise<Category[]> => await prisma.category.findMany(),
        getTransactions: async (_: unknown, args: TransactionQueryInput): Promise<Transaction[]> => {
            const { first, after, bank, account, reference, category, startDate, endDate } = args;
            let where: any = {};

            if (bank) where = { ...where, Account: { bank: { contains: bank, mode: 'insensitive' } } };
            if (account) where = { ...where, Account: { name: { contains: account, mode: 'insensitive' } } };
            if (reference) where = { ...where, reference: { contains: reference, mode: 'insensitive' } };
            if (category) where = { ...where, Category: { name: { contains: category, mode: 'insensitive' } } };
            if (startDate) where = { ...where, date: { gte: startDate } };
            if (endDate) where = { ...where, date: { ...where.date, lte: endDate } };

            return await prisma.transaction.findMany({
                where,
                take: first ? first : 100,
                skip: after ? after : 0,
            })
        },
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
