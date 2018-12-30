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
  }
}`

export { getUser, getArtistAlbums }
