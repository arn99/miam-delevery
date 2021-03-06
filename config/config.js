module.exports = {
  aws_table_name: 'deliveries',
  aws_local_config: {
    region: 'local',
    endpoint: 'http://localhost:4566'
  },
  aws_remote_config: {
    accessKeyId: process.env.keyId,
    secretAccessKey: process.env.secret,
    region: 'us-east-1',
  },
  envConfig: true,
};