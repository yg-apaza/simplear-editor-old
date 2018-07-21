type File = {
    url: string
}

type Asset = {
    name: string,
    displayName: string,
    authorName: string,
    description: string,
    thumbnail: File
}

export interface PolyListResponse {
    assets: Array<Asset>,
    nextPageToken: string,
    totalSize: number
}
