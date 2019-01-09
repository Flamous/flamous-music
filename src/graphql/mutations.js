
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

const updateAlbum = `mutation updateAlbum($albumId: ID!, $description: String, $title: String, $hasCoverImage: Boolean, $coverImagePath: String) {
  updateAlbum(albumId: $albumId, title: $title, description: $description, hasCoverImage: $hasCoverImage, coverImagePath: $coverImagePath) {
    title
    description
    albumId
    hasCoverImage
    coverImagePath
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
