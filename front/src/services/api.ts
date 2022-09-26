import axios from "axios"
import { GuiBrowserFile, GuiBucket } from "types"

const apiServer = "http://localhost:3001"

enum APIService {
  authAnonymous = 1,
  buckets,
  bucket,
  deleteFile
}

const getAPIUrl = (service: APIService, args?: {[key:string]: string}): string => {
  switch (service) {
    case APIService.authAnonymous:
      return `${apiServer}/auth/anonymous`
    case APIService.buckets:
      return `${apiServer}/buckets`
    case APIService.bucket:
        return `${apiServer}/bucket/${args.bucket}`
    case APIService.deleteFile:
      return `${apiServer}/bucket/${args.bucket}/delete`
  }
}

export const loginUser = () => {
  return axios.get<AuthLoginResponse>(getAPIUrl(APIService.authAnonymous))
}

export const getBuckets = () => {
  return axios.get<GetBucketsResponse>(getAPIUrl(APIService.buckets))
}

export const getBucket = (bucket: GuiBucket) => {
  return axios.get<GetBucketResponse>(getAPIUrl(APIService.bucket, { bucket: bucket.id }))
}

export const deleteFiles = (bucket: GuiBucket, items: GuiBrowserFile[]) => {
  return axios.post<Response>(getAPIUrl(APIService.deleteFile, { bucket: bucket.id }), {
    files: items.map(i => i.path)
  })
}

export interface Response {
  status: string
}

export interface AuthLoginResponse extends Response {
  token: string
}

export interface GetBucketsResponse extends Response {
  buckets: GuiBucket[]
}

export interface GetBucketResponse extends Response {
  files: GuiBrowserFile[]
}
