import path from "path"
import { GuiBrowserObject, GuiObjects } from "types"
import { BrowserUtils } from "./BrowserUtils"

const createItem = (name: string, prefix: string): GuiBrowserObject => {
  return {name, path : path.join(prefix, name), prefix, type : "folder" }
}

test("extractNamePrefix", () => {
  const pairs = [{
    t: "/toto/child.txt",
    r: { name: 'child.txt', prefix: 'toto', path: 'toto/child.txt'}
  }, {
    t: "toto/toto/child.txt",
    r: { name: 'child.txt', prefix: 'toto/toto', path: 'toto/toto/child.txt'}
  }]

  for (const pair of pairs) {
    expect(BrowserUtils.extractNamePrefix(pair.t)).toStrictEqual(pair.r)
  }
})

test('splitKeyPrefixes', () => {
  expect(BrowserUtils.splitKeyPrefixes('toto')).toStrictEqual(['toto'])
  expect(BrowserUtils.splitKeyPrefixes('toto/')).toStrictEqual(['toto'])
  expect(BrowserUtils.splitKeyPrefixes('toto/tata')).toStrictEqual(['toto', 'toto/tata'])
  expect(BrowserUtils.splitKeyPrefixes('/toto/tata/toto.txt')).toStrictEqual(['toto', 'toto/tata', 'toto/tata/toto.txt'])
})

test('getObjectChildren', () => {
  const objects: GuiObjects = {
    'gp' : {
      ...BrowserUtils.extractNamePrefix('gp'),
      type: 'folder'
    },
    'gp/papa' : {
      ...BrowserUtils.extractNamePrefix('gp/papa'),
      type: 'folder'
    },
    'gp/papa/girl.txt' : {
      ...BrowserUtils.extractNamePrefix('gp/papa/girl.txt'),
      type: 'file'
    },
    'gp/papa/son.txt' : {
      ...BrowserUtils.extractNamePrefix('gp/papa/son.txt'),
      type: 'file'
    },
    'gp/papa/girl/girl.txt' : {
      ...BrowserUtils.extractNamePrefix('gp/papa/girl/girl.txt'),
      type: 'file'
    },
    'gp/tonton/girl' : {
      ...BrowserUtils.extractNamePrefix('gp/tonton/girl'),
      type: 'folder'
    },
    'gp/papa2/girl' : {
      ...BrowserUtils.extractNamePrefix('gp/papa2/girl'),
      type: 'folder'
    },
  }

  let children = BrowserUtils.getObjectChildren(objects, 'gp/papa')
  let childrenPicked = children.map(c => c.path)

  expect(childrenPicked).toStrictEqual([
    'gp/papa/girl.txt',
    'gp/papa/son.txt'
  ])

  children = BrowserUtils.getObjectChildren(objects, '')
  childrenPicked = children.map(c => c.path)

  expect(childrenPicked).toStrictEqual([
    'gp'
  ])
})

test('getHierarchy', () => {
  const rootNode = BrowserUtils.getHierarchy({}, '/gp/papa/son.txt')
  const rooNodePicked = BrowserUtils.deepPickNode(['path'], rootNode)

  expect(rooNodePicked).toStrictEqual({
    object: {
      path: ''
    },
    children: [{
      object: {
        path: 'gp'
      },
      children: [{
        object: {
          path: 'gp/papa'
        },
        children: [{
          object: {
            path: 'gp/papa/son.txt'
          }
        }]
      }]
    }]
  })
})

test('getHierarchy with existing items', () => {
  const objects: GuiObjects = {
    '/gp/papa/girl.txt' : {
      ...BrowserUtils.extractNamePrefix('/gp/papa/girl.txt'),
      type: 'file'
    }
  }

  const rootNode = BrowserUtils.getHierarchy(objects, '/gp/papa/boy.txt')
  const rooNodePicked = BrowserUtils.deepPickNode(['path'], rootNode)

  expect(rooNodePicked).toStrictEqual({
    object: {
      path: ''
    },
    children: [{
      object: {
        path: 'gp'
      },
      children: [{
        object: {
          path: 'gp/papa'
        },
        children: [{
          object: {
            path: 'gp/papa/boy.txt'
          }
        }, {
          object: {
            path: 'gp/papa/girl.txt'
          }
        }]
      }]
    }]
  })
})