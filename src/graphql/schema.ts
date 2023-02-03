const typeDefs=`#graphql
type Account {
  id: String!
  name: String!
  bank: String!
  }
type Category {
  id: String!
  name: String!
  color: String 
}
type Transaction {
  id: String!
  account_id: String!
  category_id: String
  reference: String
  amount: Float!
  currency: String!
  date: String!
}
type Query {
  getAccounts: [Account]
  getCategories: [Category]
  getTransactions: [Transaction]
}
`;

export default typeDefs;
