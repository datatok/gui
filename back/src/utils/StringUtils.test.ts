import { StringUtils } from "./StringUtils"

test("String trim", () => {
  expect(StringUtils.trim("/toto/", "/")).toEqual("toto")
  expect(StringUtils.trim("/toto///", "/")).toEqual("toto")
  expect(StringUtils.trim("toto", "/")).toEqual("toto")
})

test("String rtrim", () => {
  expect(StringUtils.rtrim("/toto/", "/")).toEqual("/toto")
  expect(StringUtils.rtrim("/toto///", "/")).toEqual("/toto")
  expect(StringUtils.rtrim("toto", "/")).toEqual("toto")
  expect(StringUtils.rtrim("", "/")).toEqual("")
})

test("String ltrim", () => {
  expect(StringUtils.ltrim("/toto/", "/")).toEqual("toto/")
  expect(StringUtils.ltrim("/toto///", "/")).toEqual("toto///")
  expect(StringUtils.ltrim("toto", "/")).toEqual("toto")
  expect(StringUtils.ltrim("", "/")).toEqual("")
})

test("String pathJoin", () => {
  expect(StringUtils.pathJoin("a", "b")).toEqual("a/b")
  expect(StringUtils.pathJoin("/a", "b")).toEqual("/a/b")
  expect(StringUtils.pathJoin("a", "/b")).toEqual("a/b")
  expect(StringUtils.pathJoin("a", "/b/")).toEqual("a/b/")
  expect(StringUtils.pathJoin("/a/", "/b/", "/c/")).toEqual("/a/b/c/")
  expect(StringUtils.pathJoin("a", "/b/", "c")).toEqual("a/b/c")
})