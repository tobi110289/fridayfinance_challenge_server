import { PrismaClient } from "@prisma/client";
import fs from "fs";
import * as csv from "@fast-csv/parse";

const prisma = new PrismaClient();

async function deleteData() {
  try {
    await prisma.account.deleteMany();
    console.log("Accounts deleted");
    await prisma.category.deleteMany();
    console.log("Categories deleted");
    await prisma.transaction.deleteMany();
    console.log("Transactions deleted");
  } catch (error) {
    throw error;
  }
}

const csvStream = (
  stream: fs.ReadStream,
  handler: (data: string[][]) => Promise<void>
) => {
  let csvData: string[][] = [];
  let csvStream = csv
    .parse()
    .on("error", (error) => console.error(error))
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

async function createAccounts(data: string[][]) {
  const accounts = data.map((row) => ({
    id: row[0],
    name: row[1],
    bank: row[2],
  }));
  try {
    const res = await prisma.account.createMany({ data: accounts });
    console.log("Wrote Accounts: ", res ? res.count : res);
  } catch (error) {
    throw error;
  }
}

async function createCategories(data: string[][]) {
  const categories = data.map((row) => ({
    id: row[0],
    name: row[1],
    color: row[2],
  }));
  try {
    const res = await prisma.category.createMany({ data: categories });
    console.log("Wrote Categories: ", res ? res.count : res);
  } catch (error) {
    throw error;
  }
}

async function createTransactions(data: string[][]) {
  const categoryIds = (await prisma.category.findMany()).map(({ id }) => id);
  const transactions = data
    .map((row) => {
      const categoryExists = categoryIds.includes(row[2]);
      return {
        id: row[0],
        account_id: row[1],
        category_id: categoryExists ? row[2] : undefined,
        reference: row[3],
        amount: +row[4],
        currency: row[5],
        date: new Date(row[6]).toISOString(),
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  try {
    const res = await prisma.transaction.createMany({ data: transactions });
    console.log("Wrote Transactions: ", res ? res.count : res);
  } catch (error) {
    throw error;
  }
}

async function main() {
  const accountStream = fs.createReadStream("./data/accounts.csv");
  const categoryStream = fs.createReadStream("./data/categories.csv");
  const transactionStream = fs.createReadStream("./data/transactions.csv");

  await deleteData();

  csvStream(transactionStream, async (data) => {
    createTransactions(data);
  });
  csvStream(categoryStream, async (data) => {
    createCategories(data);
  });
  csvStream(accountStream, async (data) => {
    createAccounts(data);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
