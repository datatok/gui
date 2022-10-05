import path from "path"
import { GuiBrowserFile } from "types"
import { BrowserUtils } from "./BrowserUtils"
import { getFiles } from "./DummyData"

const createItem = (name: string, prefix: string): GuiBrowserFile => {
  return {name, path : path.join(prefix, name), prefix, type : "folder" }
}

test("Search must work", () => {
  const rootNode = getFiles()

  const found = BrowserUtils.searchNaive("2022/2", rootNode)

  expect(found).toBeDefined
  expect(found).not.toBeNull
  expect(found?.name).toEqual("2")
  expect(found?.parent?.name).toEqual("2022")
})

test("Search must fail", () => {
  const rootNode = getFiles()

  const found = BrowserUtils.searchNaive("2022/2/2022", rootNode)

  expect(found).toBeDefined
  expect(found).toBeNull
})

test("Delete simple item", () => {
  const toDelete1 = createItem("c1", "/")
  const toDelete2 = createItem("c2", "/")
  const items: GuiBrowserFile[] = [{
    ...createItem("", "/"),
    children: [
      toDelete1,
      toDelete2
    ]
  }]

  let newItems = BrowserUtils.deleteItem(items, toDelete2);

  expect(newItems).toEqual([{"children": [{"name": "c1", "prefix": "/", "path": "/c1", "type": "folder"}], "name": "", "prefix" : "/", "path": "/", "type": "folder"}])

  newItems = BrowserUtils.deleteItem(newItems, toDelete1);

  expect(newItems).toEqual([{"children": [], "name": "", "prefix" : "/", "path": "/", "type": "folder"}])
})

test("Delete complex item", () => {
  const toDelete1 = createItem("c1", "/")

  const items: GuiBrowserFile[] = [{
    ...createItem("", "/"),
    children: [
      {...toDelete1, children: [
        createItem("c1_s1", "/c1/"),
        createItem("c1_s2", "/c1/")
      ]},
      createItem("c2", "/"),

    ]
  }]

  const newItems = BrowserUtils.deleteItem(items, toDelete1);

  expect(newItems).toEqual([{"children": [{"name":"c2", "prefix": "/", "path":"/c2", "type" : "folder"}], "name": "", "prefix" : "/", "path": "/", "type": "folder"}])
})

test('rootNode', () => {
  const son = createItem("", "son")
  
  const rootNode = {
    ...createItem("root", ""),
    children : [
      createItem("", "grandpa"),
      {
        ...createItem("", "grandma"),
        children : [
          {
            ...createItem("", "pa"),
            children: [son]
          }
        ]
      }
    ]
  }
  
  BrowserUtils.resolveParentLinks(rootNode)

  const root = BrowserUtils.rootNode(son)

  expect(root.name).toEqual(rootNode.name)
})

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

test("reconciateHierarchy, empty existing nodes", () => {
  const current = createItem("child.txt", "grandpa/mama")
  const root = BrowserUtils.reconciliateHierarchy(current)
  const rootPick = BrowserUtils.deepPick(['name', 'children'], root)

  expect(rootPick.children).toEqual([
    { name: 'grandpa', children: [
      { name: 'mama', children: [
        { name: 'child.txt' }
      ]}
    ]}
  ])
})

test("reconciateHierarchy, with root existing nodes", () => {
  const current = createItem("child.txt", "grandpa/mama")
  const rootNode = {
    ...createItem('', ''),
    children: [
      createItem('grandpa', ''),
      createItem('grandma', '')
    ]
  }

  BrowserUtils.resolveParentLinks(rootNode)

  const root = BrowserUtils.reconciliateHierarchy(current, rootNode)
  const rootPick = BrowserUtils.deepPick(['name', 'children'], root)

  expect(rootPick.children).toEqual([
    { name: 'grandma' },
    { name: 'grandpa', children: [
      { name: 'mama', children: [
        { name: 'child.txt', children: undefined }
      ]}
    ]}
  ])
})

test("reconciateHierarchy, with grandpa existing nodes", () => {
  const current = createItem("child.txt", "grandpa/mama")
  const existingItems = [{
    name: 'grandpa', path: 'grandpa', prefix: '', type: 'folder',
    children: [createItem('cousin', '')]
  }]

  const root = BrowserUtils.reconciliateHierarchy(existingItems, current)
  const rootPick = BrowserUtils.deepPick(['name', 'children'], root)

  expect(rootPick.children).toEqual([
    { name: 'grandpa', children: [
      { name: 'cousin' },
      { name: 'mama', children: [
        { name: 'child.txt', children: undefined }
      ]}
    ]}
  ])
})