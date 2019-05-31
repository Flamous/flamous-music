
export const createNewAlbum = `mutation createAlbum($title: String!, $artistId: ID!) {
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

const updateAlbum = `mutation updateAlbum($albumId: ID!, $artistId: ID!, $data: AlbumInput!) {
  updateAlbum(albumId: $albumId, data: $data, artistId: $artistId) {
    title
    albumId
    lastUpdated
    imageSource
  }
}`

const createUser = `mutation createUser {
  createUser {
    userId
  }
}`
const createUserAndArtist = `mutation createUserAndArtist {
  createUserAndArtist {
    artistId
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

export const createNewArtist = `mutation createNewArtist($name: String!) {
  createNewArtist(name: $name) {
    artistId
    name
  }
}`

export const createSong = `mutation createSong($albumId: ID!) {
  createSong(albumId: $albumId) {
    songId
    title
  }
}`

export const updateSong = `mutation updateSong($songId: ID!, $albumId: ID!, $songData: SongInput!) {
  updateSong(songId: $songId, albumId: $albumId, data: $songData) {
    songId
    title
    audioSource
  }
}`

export { deleteAlbum, updateAlbum, createUser, createUserAndArtist, updateUser, createArtist }
