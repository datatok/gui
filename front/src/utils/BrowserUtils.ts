import { string } from "prop-types"
import { GuiBrowserFile } from "types"
import * as R from 'ramda'
import { StringUtils } from "./StringUtils"

const searchNaive = (path: string, rootNode?:GuiBrowserFile): GuiBrowserFile|undefined => {

  if (rootNode?.path === path) {
    return rootNode
  }

  if (rootNode?.children) {
    for (const node of rootNode.children) {
      const foundChild = BrowserUtils.searchNaive(path, node)

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
    /*parent: currentNode.parent ? 
      deepPick(properties, currentNode.parent) : 
      undefined,*/
    children: currentNode.children ? 
      currentNode.children.map(c => deepPick(properties, c)) : 
      undefined
  }
}

export const BrowserUtils = {
  
  extractNamePrefix,

  searchNaive,

  deepPick,

  resolveParentLinks: (parent: GuiBrowserFile) => {
    for (const file of parent.children) {
      file.parent = parent
      
      if (file.children) {
        BrowserUtils.resolveParentLinks(file)
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

  rootNode: (node: GuiBrowserFile): GuiBrowserFile => {
    while(node.parent) {
      node = node.parent
    }

    return node
  },

  /**
   * Link or Build the hierarchy from current to ancestor(s).
   * 
   * Attach "currentNode" to rootNode existing hierarchy, building
   */
   reconciliateHierarchy: (currentNode: GuiBrowserFile, rootNode?: GuiBrowserFile): GuiBrowserFile => {

    console.log(currentNode)
    while (currentNode.path && currentNode.path.length > 0) {
      const parentPath = currentNode.prefix
      const parentExisting = rootNode ? searchNaive(parentPath, rootNode) : undefined
      let parentNode

      if (parentExisting) {
        parentNode = {
          ...parentExisting,
          children: [...(parentExisting.children || []), currentNode]
        }

        currentNode.parent = parentNode

        break
      } else {
        const { prefix, name } = extractNamePrefix(parentPath)
        parentNode = {
          name,
          prefix,
          path: parentPath,
          type: 'folder',
          children: [currentNode]
        }
        currentNode.parent = parentNode
      }

      currentNode = parentNode
    }

    return BrowserUtils.rootNode(currentNode)
  }
}