import { string } from "prop-types"
import { GuiBrowserFile } from "types"
import * as R from 'ramda'
import { StringUtils } from "./StringUtils"

const searchNaive = (path: string, items:GuiBrowserFile[]): GuiBrowserFile|undefined => {
  for (const file of items) {
    if (file.path === path) {
      
      return file
    }

    if (file.children) {
      const foundChild = BrowserUtils.searchNaive(path, file.children)

      if (foundChild) {
        return foundChild
      }
    }
  }
}

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

const deepPick = (properties: string[], currentNode: GuiBrowserFile): any => {
  const ret = R.pick(properties, currentNode)

  return {
    ...ret,
    parent: currentNode.parent ? 
      deepPick(properties, currentNode.parent) : 
      undefined,
    children: currentNode.children ? 
      currentNode.children.map(c => deepPick(properties, c)) : 
      undefined
  }
}

export const BrowserUtils = {
  
  extractNamePrefix,

  searchNaive,

  deepPick,

  resolveParentLinks: (items: GuiBrowserFile[], parent?: GuiBrowserFile) => {
    for (const file of items) {
      file.parent = parent
      
      if (file.children) {
        BrowserUtils.resolveParentLinks(file.children, file)
      }
    }
  },

  deleteItem: (items: GuiBrowserFile[], toDelete: GuiBrowserFile): GuiBrowserFile[] => {
    return  items
      .filter(i => i.path !== toDelete.path)
      .map(i => {
        if (i.children) {
          return {...i, children: BrowserUtils.deleteItem(i.children, toDelete)}
        }

        return {...i}
      })
  },

  /**
   * Link or Build the hierarchy from current to ancestor(s).
   */
  reconciateHierarchy: (items: GuiBrowserFile[], currentNode: GuiBrowserFile): GuiBrowserFile => {

    while (currentNode.path && currentNode.path.length > 0) {
      const parentPath = currentNode.prefix
      const parentExisting = searchNaive(parentPath, items)
      let parentNode

      if (parentExisting) {
        parentNode = {
          ...parentExisting,
          children: [...(parentExisting.children || []), currentNode]
        }
      } else {
        const { prefix, name } = extractNamePrefix(parentPath)
        parentNode = {
          name,
          prefix,
          path: parentPath,
          type: 'folder',
          children: [currentNode]
        }
      }

      currentNode.parent = parentNode
      currentNode = parentNode
    }

    return currentNode
  }
}