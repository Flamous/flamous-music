const getUser = `query getUser {
  user {
    artistId
  }
}`

const getArtistAlbums = `query getArtistAlbums ($artistId: ID!) {
  getArtistAlbums (artistId: $artistId) {
    title
    albumId
    createdAt
    artists
    coverImagePath
  }
}`

const getAlbum = `query getAlbum ($albumId: ID!) {
  album(albumId: $albumId) {
    title
    description
    coverImagePath
  }
}`

export { getUser, getArtistAlbums, getAlbum }
