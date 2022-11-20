export interface GuiBucket {
  /**
   * Unique ID (host - name)
   */
  id: string
  /**
   * Name of the bucket
   */
  name: string
  /**
   * Title to display
   */
  title: string

  /**
   * Host endpoint name
   */
  host: string
}

export interface GuiBrowserObject {
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

  /**
   * Secure link for download object
   */
  downloadLink?: string

  /**
   * RBAC verbs: list, read, write, download
   */
  verbs: string[]
}

/**
 * Represent object within graph (only children relation)
 */
export interface GuiBrowserObjectNode {
  name: string
  path: string
  children?: { [key: string]: GuiBrowserObjectNode }
}

/**
 * Represent a store of objects
 */
export interface GuiObjects { [key: string]: GuiBrowserObject }

export enum ObjectItemAction {
  Delete = 1,
  Move,
  Copy,
  Download,
  Share,
  NewFolder
}
