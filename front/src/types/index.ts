export type GuiBucket = {
  id: string
  name: string
  host: string
  auth_key?: string
  auth_secret?: string
}

export type GuiBrowserFile = {
  name: string
  path: string
  type: string
  children?: GuiBrowserFile[]
  parent?: GuiBrowserFile
}