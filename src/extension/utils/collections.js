import { getEntityManager } from './qustodio';

export class Collections {
  static get accountsCollection() {
    const collection = new qustodio.collections.AccountsCollection();
    collection.addItemsFromArray(getEntityManager().getAllAccounts());
    return collection;
  }

  static get accountCalculationsCollection() {
    const collection = new qustodio.collections.AccountCalculationsCollection();
    collection.addItemsFromArray(getEntityManager().getAllAccountCalculations());
    return collection;
  }

  static get masterCategoriesCollection() {
    const collection = new qustodio.collections.MasterCategoriesCollection();
    collection.addItemsFromArray(getEntityManager().getAllMasterCategories());
    return collection;
  }

  static get payeesCollection() {
    const collection = new qustodio.collections.PayeesCollection();
    collection.addItemsFromArray(getEntityManager().getAllPayees());
    return collection;
  }

  static get subCategoriesCollection() {
    const collection = new qustodio.collections.SubCategoriesCollection();
    collection.addItemsFromArray(getEntityManager().getAllSubCategories());
    return collection;
  }

  static get subTransactionsCollection() {
    const collection = new qustodio.collections.SubTransactionsCollection();
    collection.addItemsFromArray(getEntityManager().getAllSubTransactions());
    return collection;
  }

  static get transactionsCollection() {
    const collection = new qustodio.collections.TransactionsCollection();
    collection.addItemsFromArray(getEntityManager().getAllTransactions());
    return collection;
  }
}
