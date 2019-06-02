import API, { graphqlOperation } from '@aws-amplify/api'

export default function gqlApi (options) {
  console.info('Flamous: GraphQL action -->', options)
  let { operation, parameters = {}, authMode = 'AMAZON_COGNITO_USER_POOLS' } = options
  return new Promise(function (resolve, reject) {
    console.log("Making call with authMode ", authMode)
    API.graphql(graphqlOperation(operation, parameters), authMode)
    .then((response) => {
      let unwrappedData = response.data[Object.keys(response.data)[0]]
      resolve(unwrappedData)
    })
    .catch((error) => {
      console.warn('Flamous: API call not successful', error)
      reject(error)
    })
  })
}