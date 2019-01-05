
const createAlbum = `mutation createAlbum($title: String!, $artistId: ID!) {
  createAlbum(artistId: $artistId, title: $title) {
      albumId
      title
  }
}`

const deleteAlbum = `mutation deleteAlbum($albumId: ID!) {
  deleteAlbum(albumId: $albumId) {
    albumId
  }
}`

const updateAlbum = `mutation updateAlbum($albumId: ID!, $description: String, $title: String) {
  updateAlbum(albumId: $albumId, title: $title, description: $description) {
    title
    description
    albumId
  }
}`

const createUser = `mutation createUser {
  createUser {
    userId
  }
}`

const updateUser = `mutation updateUser($artistId: ID) {
  updateUser(artistId: $artistId) {
    artistId
  }
}`

const createArtist = `mutation createArtist($name: String) {
  createArtist(name: $name) {
    artistId
  }
}`

export { createAlbum, deleteAlbum, updateAlbum, createUser, updateUser, createArtist }
