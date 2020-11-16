const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const config = require('../../config/config.js');
var isDev = false;
/* if (process.env.NODE_ENV.includes("production")) {
  isDev = false;
} */
if (process.env.NODE_ENV == "production") {
  isDev = false;
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
  if (isDev) {
    console.log('isDev');
    AWS.config.update(config.aws_local_config);
  } else {
    console.log('isProd');
    AWS.config.update(config.aws_remote_config);
  }
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.aws_table_name
  };
  docClient.scan(params, function(err, data) {
    if (err) {
      res.send({
        success: false,
        message: 'Error: Server error',
        error: err
      });
    } else {
      const { Items } = data;
      res.send({
        success: true,
        message: 'Loaded deliveriess',
        deliveriess: Items
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
    const deliveries = req.body;
    // Not actually unique and can create problems.
    //const id = uuidv4();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      Item: deliveries
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
  module.exports = router;