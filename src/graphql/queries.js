export const getUser = `query getUser {
  getUser {
    userNotExists
    userId
    artistId
  }
}`

export const getAlbumList = `query getAlbumList ($artistId: ID!) {
  getAlbumList (artistId: $artistId) {
    title
    albumId
    artistId
    createdAt
    imageSource
    published
  }
}`

export const getSongList = `query getSongList ($albumId: ID!) {
  getSongList (albumId: $albumId) {
    title
    songId
    artistId
    audioSource
  }
}`

export const getAlbum = `query getAlbum ($albumId: ID!, $artistId: ID!) {
  getAlbum(albumId: $albumId, artistId: $artistId) {
    title
    albumId
    artistId
    createdAt
    imageSource
    published
  }
}`
