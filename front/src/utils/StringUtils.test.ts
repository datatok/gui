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