import { GuiBucket } from "types"
import { GuiBrowserFile } from "../types"
import { StringUtils } from "./StringUtils"

const getFilesR = (generator: string, parent: GuiBrowserFile) :GuiBrowserFile[] => {
  const years = [2021, 2022, 2023]
  const months = [1,2,3]
  const days = [1,2,3,4,5]

  const b = (name: string):GuiBrowserFile => {
    return {
      name,
      parent,
      prefix: StringUtils.trim(`${parent.path}/${name}`, '/'),
      path: StringUtils.trim(`${parent.path}/${name}`, '/'),
      type: 'folder',
    }
  }

  switch(generator)
  {
    case "year": 
      return years.map((y): GuiBrowserFile => {
        return b(y.toString())
      }).map(f => {
        return {
          ...f,
          children: getFilesR("month", f)
        }
      })
    case "month": 
      return months.map((y): GuiBrowserFile => {
        return b(y.toString())
      }).map(f => {
        return {
          ...f,
          children: getFilesR("day", f)
        }
      })
    case "day": 
      return days.map((y): GuiBrowserFile => {
        return b(y.toString())
      }).map(f => {
        return {
          ...f,
          children: getFilesR("file", f)
        }
      })
    default: 
      return years.map((y): GuiBrowserFile => {
        return b(`file ${y.toString()}`)
      })
  }
}

export const getFiles = (): GuiBrowserFile => {
  const root: GuiBrowserFile = {
    name: "",
    path: "/",
    prefix: "/",
    type: "root"
  }

  root.children = getFilesR("year", root)

  return root
}

export const getBuckets = (): GuiBucket[] => {
  return [
    {
      name: "steam",
      host: "dev-c2",
      id: "dev-c2-steam",
    },
    {
      name: "pocs",
      host: "dev-c2",
      id: "dev-c2-pocs",
    },
    {
      name: "steam",
      host: "prod-c2",
      id: "prod-c2-steam",
    }
  ]
}