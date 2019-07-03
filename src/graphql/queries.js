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

export const getAlbum = `query getAlbum ($albumId: ID!) {
  getAlbum(albumId: $albumId) {
    title
    albumId
    artistId
    createdAt
    imageSource
    published
  }
}`

export const getFeatured = `query getFeatured {
  getFeatured {
    songs {
      title
      imageSource
      audioSource
      albumId
      artistId
    }
    albums {
      title
      imageSource
    }
  }
}`

export let getArtist = `query getArtist ($artistId: ID!) {
  getFeatured (artistId: $artistId) {
    name
    imageSource
    songs {
      title
      imageSource
      audioSource
      albumId
    }
    albums {
      title
      imageSource
    }
  }
}`
