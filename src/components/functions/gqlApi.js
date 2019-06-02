import API, { graphqlOperation } from '@aws-amplify/api'

export default function gqlApi (options) {
  console.info('Flamous: GraphQL action -->', options)
  let { operation, parameters = {}, authMode = 'AMAZON_COGNITO_USER_POOLS' } = options
  return new Promise(function (resolve, reject) {
    API.graphql({
      query: operation,
      variables: parameters,
      authMode
    })
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