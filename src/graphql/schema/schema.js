const palletSchema = () => {
  const tableSchema = {
    TableName : "Pallet_Repo",
    KeySchema: [
        { AttributeName: "date", KeyType: "HASH"},  //Partition key
        { AttributeName: "pallet", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "date", AttributeType: "S" },
        { AttributeName: "pallet", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    StreamSpecification: {
      StreamEnabled: false
    }
  }
  return tableSchema
}

const typeDefs = () => {
  const type = [`
    type pallet {
      date: String
      item: String
      barcode: String
      pallet: Int
      product: String
      Warehouse: String
      info: Info
    }

    type Info {
      Packing: String
      PCS: String
    }

    type Query {
      allPallet: [pallet]
      filterPalletNum(start_date: String, end_date: String, start_pallet: Int, end_pallet: Int): [pallet]
      filterPalletProduct(start_date: String, end_date: String, product: String): [pallet]
    }

    schema {
      query: Query
    }`];
  return type;
}

module.exports = { palletSchema , typeDefs}
