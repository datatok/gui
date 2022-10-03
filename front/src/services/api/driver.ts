import axios from "axios"

const apiServer = "http://localhost:3001"

enum APIService {
  authAnonymous = 1,
  buckets,
  bucket,
  bucketBrowse,
  deleteFile
}

const getAPIUrl = (service: APIService, args?: {[key:string]: string}): string => {
  switch (service) {
    case APIService.authAnonymous:
      return `${apiServer}`
    case APIService.buckets:
      return `${apiServer}`
    case APIService.bucketBrowse:
     
    case APIService.bucket:
        return `${apiServer}/bucket/get/${args.bucket}`
    case APIService.deleteFile:
      return `${apiServer}/bucket/delete/${args.bucket}`
  }
}

export const get =<T>(pathURL: string) => {
  const fullURL = `${apiServer}${pathURL}`
  return axios.get<T>(fullURL)
}