import { BrowserUtils } from "./BrowserUtils"
import { getFiles } from "./DummyData"

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