import { GuiBrowserObject, GuiBrowserObjectNode, GuiObjects } from 'types'
import * as R from 'ramda'
import { StringUtils } from './StringUtils'

/**
 * @param path
 * @returns
 */
const extractNamePrefix = (path: string): { name: string, prefix: string, path: string } => {
  if (path === '') {
    return { path: '', name: '', prefix: '' }
  }

  const fixPath = StringUtils.trim(path, '/')
  const pos = fixPath.lastIndexOf('/') + 1

  return { path: fixPath, name: fixPath.substring(pos), prefix: fixPath.substring(0, pos - 1) }
}

const deepPick = (properties: string[], currentNode: any): any => {
  const ret = R.pick(properties, currentNode)

  if (currentNode.children.length > 0) {
    ret.children = ret.children.map(c => deepPick(properties, c))
  }

  return ret
}

const splitKeyPrefixes = (key: string): string[] => {
  const ret: string[] = []

  key = StringUtils.trim(key, '/')

  for (let pos = 0; pos !== -1;) {
    pos = key.indexOf('/', pos + 1)

    ret.push(pos === -1 ? key : key.substring(0, pos))
  }

  return ret
}

/**
 * Return direct children from a prefix key
 */
const getObjectChildren = (objects: GuiObjects, key: string): GuiBrowserObject[] => {
  const keySlash = key === '' ? '' : `${key}/`
  const keyLength = keySlash.length

  return R
    .toPairs(objects)
    .filter(([k, v]: [k:string, v:GuiBrowserObject]) => {
      return k !== key &&
        k.startsWith(keySlash) &&
        !k.includes('/', keyLength)
    })
    .map(([k, v]) => v)
}

const hierarchy = (pathsParts: string[][], depth: number, path: string, name: string): GuiBrowserObjectNode => {
  const lookup = {}

  pathsParts.forEach(p => {
    if (p.length > depth) {
      const k = p[depth]

      if (lookup[k] === undefined) {
        lookup[k] = [p]
      } else {
        lookup[k].push(p)
      }
    }
  })

  const m = (v: string[][], k: string): GuiBrowserObjectNode => hierarchy(v, depth + 1, path + (path !== '' ? '/' : '') + k, k)

  return { name, path, children: R.mapObjIndexed(m, lookup) }
}

const getHierarchy2 = (objects: GuiObjects): GuiBrowserObjectNode => {
  const isFolder = (v: GuiBrowserObject, k: string): boolean => v.type === 'folder'
  const onlyFolders = R.pickBy(isFolder, objects)

  const pathPars = Object.keys(onlyFolders).map(p => p.split('/'), '')

  return hierarchy(pathPars, 0, '', '')
}

const mergeObjects = (prefix: string, currentObjects: GuiObjects, newObjects: GuiObjects): GuiObjects => {
  if (prefix !== '') {
    prefix += '/'
  }

  const isNotChild = (_: GuiBrowserObject, key: string): boolean => {
    return !key.startsWith(prefix)
  }

  const cleanObjects = R.pickBy(isNotChild, currentObjects) //= > {A: 3, B: 4}

  return R.mergeLeft(cleanObjects, newObjects)
}

/**
 * Get all the hierarchy from objects collection.
 * Only "folder"
 * @returns The root node
 */
/* const getHierarchy = (objects: GuiObjects, key: string): GuiBrowserObjectNode => {
  const rootNode:GuiBrowserObjectNode = {
    children: {},
    object: {
      ...extractNamePrefix(''),
      type: 'folder'
    }
  }

  const keyParts = splitKeyPrefixes(key)

  let parentNode = rootNode

  keyParts.forEach(keyPart => {
    const node: GuiBrowserObjectNode = {
      children: {},
      object: {
        ...extractNamePrefix(keyPart),
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
} */

export const BrowserUtils = {

  extractNamePrefix,

  deepPick,

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
  getHierarchy: getHierarchy2,

  /**
   * Merge objects (remove not existing)
   */
  mergeObjects
}
