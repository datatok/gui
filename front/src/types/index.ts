export interface GuiBucket {
  id: string
  name: string
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
