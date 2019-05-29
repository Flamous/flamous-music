export const getUser = `query getUser {
  getUser {
    userNotExists
    userId
    artistId
  }
}`

export const getArtistAlbums = `query getArtistAlbums ($artistId: ID!) {
  getArtistAlbums (artistId: $artistId) {
    title
    description
    albumId
    createdAt
    lastUpdated
    artists
    coverImagePath
  }
}`

export const getAlbum = `query getAlbum ($albumId: ID!) {
  album(albumId: $albumId) {
    title
    lastUpdated
    createdAt
    description
    coverImagePath
  }
}`
