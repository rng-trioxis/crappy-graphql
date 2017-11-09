const dynamoConnection = require('../database/pallet_op.js')

const getResolver = () => {
  var resolver = {
    Query: {
      allPallet(root) {
        return dynamoConnection.getAllPallet()
      },
      filterPalletNum(root, {start_date, end_date, start_pallet, end_pallet}){
        var properties = {
          "start_date": start_date,
          "end_date": end_date,
          "start_pallet": start_pallet,
          "end_pallet": end_pallet
        }
        return dynamoConnection.filterPalletNum(properties)
      },
      filterPalletProduct(root, {start_date, end_date, product}){
        var properties = {
          "start_date": start_date,
          "end_date": end_date,
          "product": product
        }
        return dynamoConnection.filterPalletProduct(properties)
      }
    }
  };
  return resolver
}

module.exports = {getResolver}
