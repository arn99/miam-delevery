const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const config = require('../config/config.js');
var isDev = config.envConfig;

// env test for config
if (process.env.NODE_ENV == "production") {
  isDev = false;
}
if (isDev) {
  console.log('isDev');
  AWS.config.update(config.aws_local_config);
} else {
  console.log('isProd');
  AWS.config.update(config.aws_remote_config);
}
// Get a single fruit by id
router.get('/deliveries/:id', (req, res, next) => {
  if (isDev) {
   
    console.log('isDev');
    AWS.config.update(config.aws_local_config);
  } else {
    console.log('isProd');
    AWS.config.update(config.aws_remote_config);
  }
    const id = req.params.id;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: config.aws_table_name,
        KeyConditionExpression: 'id = :i',
        ExpressionAttributeValues: {
            ':i': id
        }
    };
    docClient.query(params, function(err, data) {
        if (err) {
            res.send({
                success: false,
                message: 'Error: Server error',
                error: err
            });
        } else {
            console.log('data', data);
            const { Items } = data;
            res.send({
                success: true,
                message: 'Loaded deliveriess',
                deliveriess: Items
            });
        }
    });
});
// Gets all deliveriess
router.get('/deliveries', (req, res, next) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      /* KeyConditionExpression: 'paymentState = :v_payment AND etat = :v_etat', */
      IndexName: "etat-index",
      KeyConditionExpression: 'etat = :v_etat',
      ExpressionAttributeValues: {
        ":v_etat": "ready"
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        console.log(err)
        res.send({
          success: false,
          message: 'Error: Server error',
          error: err
        });
        
      } else {
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded orders',
          orders: Items
        });
      }
    });
}); // end of router.get(/deliveriess)

// Add a fruit
router.post('/deliveries', (req, res, next) => {
  if (isDev) {
    console.log('isDev');
    AWS.config.update(config.aws_local_config);
  } else {
    console.log('isProd');
    AWS.config.update(config.aws_remote_config);
  }
    const delivery = req.body;
    // Not actually unique and can create problems.
    //const id = uuidv4();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      Item: delivery
    };
    docClient.put(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Added fruit',
          deliveries: Items
        });
      }
    });
  });
// UPDATE a fruit
router.put('/deliveries/:id', (req, res, next) => {
    console.log(req.params.id)
    const state = req.body.etat;
    const key = req.params.id;
    // update order from dynamodb
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      Key: {"id": key.toString()},
      UpdateExpression: "set etat = :s",
      ExpressionAttributeValues:{
        ":s":state.toString(),
      },
      
    ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, function(err, data) {
      console.log(err)
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'UpdateItem succeeded',
          deliveries: Items
        });
      }
    });
  });
module.exports = router;