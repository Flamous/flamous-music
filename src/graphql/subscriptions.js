const onCreatedAlbum = `subscription onCreatedAlbum($artistId: ID!) {
  onCreatedAlbum(artistId: $artistId) {
    title
    albumId
  }
}`

export { onCreatedAlbum }
