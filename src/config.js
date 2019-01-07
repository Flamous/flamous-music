import Amplify from '@aws-amplify/core'

const isProductionContext = process.env.CONTEXT === 'production'

const API_ENDPOINT = isProductionContext
  ? process.env.API
  : process.env.DEV_API

const IDENTITY_POOL = isProductionContext
  ? process.env.IDENTITY_POOL
  : process.env.DEV_IDENTITY_POOL

const USER_POOL = isProductionContext
  ? process.env.USER_POOL
  : process.env.DEV_USER_POOL

const USER_POOL_CLIENT = isProductionContext
  ? process.env.USER_POOL_CLIENT
  : process.env.DEV_USER_POOL_CLIENT

const S3_BUCKET = isProductionContext
  ? process.env.S3_BUCKET
  : process.env.DEV_S3_BUCKET

Amplify.configure({
  aws_appsync_graphqlEndpoint: API_ENDPOINT,
  aws_appsync_region: 'eu-central-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  Auth: {
    region: 'eu-central-1',
    userPoolId: USER_POOL,
    identityPoolId: IDENTITY_POOL,
    userPoolWebClientId: USER_POOL_CLIENT
  },
  Storage: {
    bucket: S3_BUCKET,
    region: 'eu-central-1'
  }
})
