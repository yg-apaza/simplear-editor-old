type File = {
    url: string
}

// TODO: Join with PolyListResponse > Asset type
export interface PolyGetResponse {
    name: string,
    displayName: string,
    authorName: string,
    description: string,
    thumbnail: File
}
