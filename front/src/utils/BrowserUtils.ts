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
    return {
      object: R.pick(properties, currentNode.object),
      children: currentNode.children.map(c => deepPickNode(properties, c))
    }
  }

  return {
    object: R.pick(properties, currentNode.object)
  }
}

export const BrowserUtils = {
  
  extractNamePrefix,

  deepPick,

  deepPickNode,

  deleteItem: (items: GuiBrowserObject[], toDelete: GuiBrowserObject): GuiBrowserObject[] => {
    return  []
  },

  getObjectChildren: (objects: GuiObjects, key: string): GuiBrowserObject[] => {
    return R.
      toPairs(objects).
      filter(([k, v]: [k:string, v:GuiBrowserObject]) => {
        return k !== key && k.startsWith(key)
      }).
      map(([k, v]) => v)
  },

  splitKeyPrefixes: (key: string): string[] => {
    const ret = []

    key = StringUtils.trim(key, '/')

    for (let pos = 0; pos !== -1; ) {
      pos = key.indexOf('/', pos + 1)

      ret.push(pos === -1 ? key : key.substring(0, pos))
    }

    return ret
  },

  /**
   * Build a "children" hierarchy, and return the root node.
   * @param objects 
   * @param key 
   */
  getHierarchy: (objects: GuiObjects, key: string): GuiBrowserObjectNode => {
    const rootNode:GuiBrowserObjectNode = {
      object: {
        ...BrowserUtils.extractNamePrefix(''),
        type: 'folder'
      }
    }

    let parentNode = rootNode

    for (let pos = 0; pos !== -1; ) {
      pos = key.indexOf('/', pos + 1)

      const nodeKey = pos === -1 ? key : key.substring(0, pos)
      const node: GuiBrowserObjectNode = {
        object: {
          ...BrowserUtils.extractNamePrefix(nodeKey),
          type: 'folder'
        },
      }

      parentNode.children = [node]
      parentNode = node
    }

    return rootNode
  }
}