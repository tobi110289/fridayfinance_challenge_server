import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
    Query: {
        getAccounts: () => prisma.account.findMany(),
        getCategories: () => prisma.category.findMany(),
        getTransactions: () => prisma.transaction.findMany(),
    },
};
