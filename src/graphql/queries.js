const getUser = `query getUser {
  user {
    artistId
  }
}`

const getArtistAlbums = `query getArtistAlbums ($artistId: ID!) {
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

const getAlbum = `query getAlbum ($albumId: ID!) {
  album(albumId: $albumId) {
    title
    lastUpdated
    createdAt
    description
    coverImagePath
  }
}`

export { getUser, getArtistAlbums, getAlbum }
