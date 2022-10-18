import { GuiBrowserObject, GuiObjects } from 'types'
import { BrowserUtils } from './BrowserUtils'

test('extractNamePrefix', () => {
  const pairs = [{
    t: '/toto/child.txt',
    r: { name: 'child.txt', prefix: 'toto', path: 'toto/child.txt' }
  }, {
    t: 'toto/toto/child.txt',
    r: { name: 'child.txt', prefix: 'toto/toto', path: 'toto/toto/child.txt' }
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
    gp: {
      ...BrowserUtils.extractNamePrefix('gp'),
      type: 'folder'
    },
    'gp/papa': {
      ...BrowserUtils.extractNamePrefix('gp/papa'),
      type: 'folder'
    },
    'gp/papa/girl.txt': {
      ...BrowserUtils.extractNamePrefix('gp/papa/girl.txt'),
      type: 'file'
    },
    'gp/papa/son.txt': {
      ...BrowserUtils.extractNamePrefix('gp/papa/son.txt'),
      type: 'file'
    },
    'gp/papa/girl/girl.txt': {
      ...BrowserUtils.extractNamePrefix('gp/papa/girl/girl.txt'),
      type: 'file'
    },
    'gp/tonton/girl': {
      ...BrowserUtils.extractNamePrefix('gp/tonton/girl'),
      type: 'folder'
    },
    'gp/papa2/girl': {
      ...BrowserUtils.extractNamePrefix('gp/papa2/girl'),
      type: 'folder'
    }
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

test('getHierarchy 2', () => {
  const objects: GuiObjects = {
    Storage: {
      path: 'Storage',
      name: 'Storage',
      prefix: '',
      type: 'folder'
    },
    'Storage/Drivers': {
      name: 'Drivers',
      type: 'folder',
      prefix: 'Storage',
      path: 'Storage/Drivers'
    },
    'Storage/storage.service.spec.ts': {
      name: 'storage.service.spec.ts',
      type: 'file',
      size: 866,
      editDate: '2022-10-02T00:55:35.734Z',
      prefix: 'Storage',
      path: 'Storage/storage.service.spec.ts'
    }
  }

  const rootNode = BrowserUtils.getHierarchy(objects)

  expect(rootNode).toEqual({
    name: '',
    path: '',
    children: {
      Storage: {
        name: 'Storage',
        path: 'Storage',
        children: {
          Drivers: {
            name: 'Drivers',
            path: 'Storage/Drivers',
            children: {}
          }
        }
      }
    }
  })
})

test('merge objects', () => {
  const obj: GuiBrowserObject = {
    name: '',
    path: '',
    prefix: '',
    type: 'file'
  }

  const existingObjects: GuiObjects = {
    'a/b/c.txt': obj,
    'a/b/d.txt': obj,
    'a/c/b.txt': obj
  }

  const newObjects = {
    'a/b/d.txt': obj,
    'a/b/e.txt': obj
  }

  const res = BrowserUtils.mergeObjects('a/b', existingObjects, newObjects)

  expect(res).toStrictEqual({
    'a/c/b.txt': obj,
    'a/b/d.txt': obj,
    'a/b/e.txt': obj
  })
})
