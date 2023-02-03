import { PrismaClient } from '@prisma/client'
import fs from 'fs';
import * as csv from '@fast-csv/parse';

const prisma = new PrismaClient()

async function main() {
    const accountStream = fs.createReadStream("./data/accounts.csv")
    const categoryStream = fs.createReadStream("./data/categories.csv");
    const transactionStream = fs.createReadStream("./data/transactions.csv");

    await prisma.account.deleteMany();
    console.log("Accounts deleted");
    await prisma.category.deleteMany();
    console.log("Categories deleted");
    await prisma.transaction.deleteMany();
    console.log("Transactions deleted");


    const csvStream = (stream: fs.ReadStream, handler: (data: string[][]) => Promise<void>) => {
        let csvData: string[][] = [];
        let csvStream = csv
            .parse()
            .on("error", error => console.error(error))
            .on("data", function (data) {
                csvData.push(data);
            })
            .on("end", async function () {
                csvData.shift();
                try {
                    await handler(csvData);
                } catch (error) {
                    console.error(error);
                }
            });
        stream.pipe(csvStream);
    };

    csvStream(accountStream, async (data) => {
        const accounts = data.map((row) => ({
            id: row[0],
            name: row[1],
            bank: row[2],
        }));
        const res = await prisma.account.createMany({ data: accounts });
        console.log("Wrote Accounts: ", res ? res.count : res)
    });

    csvStream(categoryStream, async (data) => {
        const categories = data.map((row) => ({
            id: row[0],
            name: row[1],
            color: row[2],
        }));
        const res = await prisma.category.createMany({ data: categories });
        console.log("Wrote Categories: ", res ? res.count : res)
    });

    csvStream(transactionStream, async (data) => {
        const categoryIds = (await prisma.category.findMany()).map(({ id }) => id);
        const transactions = data.map((row) => {
            const categoryExists = categoryIds.includes(row[2]);
            return {
                id: row[0],
                account_id: row[1],
                category_id: categoryExists ? row[2] : undefined,
                reference: row[3],
                amount: +row[4],
                currency: row[5],
                date: new Date(row[6]).toISOString(),
            }
        });
        const res = await prisma.transaction.createMany({ data: transactions });
        console.log("Wrote Transactions: ", res ? res.count : res)
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })