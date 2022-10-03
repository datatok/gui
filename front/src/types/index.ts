export type GuiBucket = {
  id: string
  name: string
  host: string
}

export type GuiBrowserFile = {
  name: string
  
  /**
   * parent
   */
  prefix: string
  
  /**
   * prefix + name
   */
  path: string
  
  /**
   * file / folder
   */
  type: string

  /**
   * size in bytes
   */
  size?: number

  /**
   * Date to parse
   */
  editDate?: string


  children?: GuiBrowserFile[]
  parent?: GuiBrowserFile
}