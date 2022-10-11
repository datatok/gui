import { string } from "prop-types"
import { GuiBrowserObject, GuiBrowserObjectNode, GuiObjects } from "types"
import * as R from 'ramda'
import { StringUtils } from "./StringUtils"

/**
 * @param path 
 * @returns 
 */
const extractNamePrefix = (path: string): { name: string, prefix: string, path: string } => {
  if (path === '') {
    return {path: '', name: '', prefix: ''}
  }

  const fixPath = StringUtils.trim(path, '/')
  const pos = fixPath.lastIndexOf('/') + 1

  return { path: fixPath, name: fixPath.substring(pos), prefix: fixPath.substring(0, pos - 1)} 
}

const deepPick = (properties: string[], currentNode: any): any => {
  const ret = R.pick(properties, currentNode)
  
  if (currentNode.children) {
    ret.children = ret.children.map(c => deepPick(properties, c))
  }

  return ret
}

const deepPickNode = (properties: string[], currentNode: GuiBrowserObjectNode): any => {

  if (currentNode.children) {
    const pickChildren = (v: GuiBrowserObjectNode) => deepPickNode(properties, v);
    return {
      object: R.pick(properties, currentNode.object),
      children: R.map(pickChildren, currentNode.children)
    }
  }

  return {
    object: R.pick(properties, currentNode.object)
  }
}

const splitKeyPrefixes = (key: string): string[] => {
  const ret = []

  key = StringUtils.trim(key, '/')

  for (let pos = 0; pos !== -1; ) {
    pos = key.indexOf('/', pos + 1)

    ret.push(pos === -1 ? key : key.substring(0, pos))
  }

  return ret
}

const getObjectChildren = (objects: GuiObjects, key: string): GuiBrowserObject[] => {
  const keySlash = key === '' ? '' : `${key}/`
  const keyLength = keySlash.length

  return R.
    toPairs(objects).
    filter(([k, v]: [k:string, v:GuiBrowserObject]) => {
      return k !== key 
        && k.startsWith(keySlash) 
        && k.indexOf('/', keyLength) === -1
    }).
    map(([k, v]) => v)
}

export const BrowserUtils = {
  
  extractNamePrefix,

  deepPick,

  deepPickNode,

  deleteItem: (items: GuiBrowserObject[], toDelete: GuiBrowserObject): GuiBrowserObject[] => {
    return  []
  },

  /**
   * Return direct children
   * @param objects 
   * @param key 
   * @returns 
   */
  getObjectChildren,

  /**
   * "/a/b/c.txt" => ["a, "a/b", "a/b/c.txt"]
   * @param key 
   * @returns 
   */
  splitKeyPrefixes,

  /**
   * Build a "children" hierarchy, with only "folder", and return the root node.
   * From all objects
   * @param objects 
   * @param key 
   */
  getHierarchy: (objects: GuiObjects, key: string): GuiBrowserObjectNode => {
    const rootNode:GuiBrowserObjectNode = {
      children: {},
      object: {
        ...BrowserUtils.extractNamePrefix(''),
        type: 'folder'
      }
    }

    const keyParts = splitKeyPrefixes(key)

    let parentNode = rootNode

    keyParts.forEach(keyPart => {
      const node: GuiBrowserObjectNode = {
        children: {},
        object: {
          ...BrowserUtils.extractNamePrefix(keyPart),
          type: 'folder'
        },
      }

      getObjectChildren(objects, keyPart)
        .forEach(object => {
          node.children[object.path] = {
            children: {},
            object
          }
        })

      parentNode.children = {
        [node.object.path]: node,
        ...parentNode.children
      }

      parentNode = node
    })

    return rootNode
  }
}