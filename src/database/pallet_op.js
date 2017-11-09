var AWS = require('aws-sdk')
var palletSchema = require('../graphql/schema/schema.js').palletSchema()

AWS.config.update({
  accessKeyId      : process.env.ACCESSKEY,
  secretAccessKey  : process.env.ACCESSKEYID,
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT
});

const dynamoDB = new AWS.DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient()


/**
 * Get record from user table
 * @param {String} tableName
*/

const isTable = () => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: palletSchema.TableName
        }
        dynamoDB.describeTable(params, (err, data) => {
            if (err) return reject(false)
            return resolve(true)
        })
    })
}

const getAllPallet = () => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: palletSchema.TableName
        }
        docClient.scan(params, (err, data) => {
            if (err) {
                return reject(err)
            }
            var result = data.Items.sort(function(a,b) {
              return a.pallet - b.pallet;
            })
            resolve (result)
        })
    })
}

const filterPalletNum = (properties) => {
   return new Promise((resolve, reject) => {
     var params = {
        TableName : `${palletSchema.TableName}`,
        ProjectionExpression:"#date, #pallet, product, Warehouse, info",
        FilterExpression: "#date between :start_date and :end_date and #pallet between :start_pallet and :end_pallet",
        ExpressionAttributeNames:{
            "#pallet": "pallet",
            "#date": "date",
        },
        ExpressionAttributeValues: {
            ":start_date": (properties.start_date == "") ? "0" : properties.start_date,
            ":end_date": (properties.end_date == "") ? "9999999" : properties.end_date,
            ":start_pallet": properties.start_pallet,
            ":end_pallet": properties.end_pallet,
        }
    };
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            var result = data.Items.sort(function(a,b) {
              return a.pallet - b.pallet;
            })
            resolve (result)
        }
    });
  })
}

const filterPalletProduct = (properties) => {
   return new Promise((resolve, reject) => {
     var params = {
        TableName : `${palletSchema.TableName}`,
        ProjectionExpression:"#date, pallet, #product, Warehouse, info",
        FilterExpression: "#date between :start_date and :end_date and contains(#product, :product)",
        ExpressionAttributeNames:{
            "#date": "date",
            "#product": "product"
        },
        ExpressionAttributeValues: {
            ":start_date": (properties.start_date == "") ? "0" : properties.start_date,
            ":end_date": (properties.end_date == "") ? "9999999" : properties.end_date,
            ":product": properties.product
        }
    };
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            var result = data.Items.sort(function(a,b) {
              return a.pallet - b.pallet;
            })
            resolve (result)
        }
    });
  })
}

// Export functions
module.exports = { isTable ,getAllPallet, filterPalletNum, filterPalletProduct}
