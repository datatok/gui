import path from "path"
import { GuiBrowserFile } from "types"
import { BrowserUtils } from "./BrowserUtils"
import { getFiles } from "./DummyData"

const createItem = (name: string, prefix: string): GuiBrowserFile => {
  return {name, path : path.join(prefix, name), prefix, type : "folder" }
}

test("Search must work", () => {
  const items = getFiles()

  const found = BrowserUtils.searchNaive("2022/2", items)

  expect(found).toBeDefined
  expect(found).not.toBeNull
  expect(found?.name).toEqual("2")
  expect(found?.parent?.name).toEqual("2022")
})

test("Search must fail", () => {
  const items = getFiles()

  const found = BrowserUtils.searchNaive("2022/2/2022", items)

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