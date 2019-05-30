import API from '@aws-amplify/api'

export default function gqlApi (options) {
  console.info('Flamous: GraphQL action -->', options)
  let { operation, parameters = {} } = options
  return new Promise(function (resolve, reject) {
    API.graphql(graphqlOperation(operation, parameters))
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