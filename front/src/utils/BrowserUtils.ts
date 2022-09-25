import { GuiBrowserFile } from "types"

export const BrowserUtils = {
  searchNaive: (path: string, items:GuiBrowserFile[]): GuiBrowserFile|undefined => {
    for (const file of items) {
      if (file.path === path) {
        
        return file
      }
  
      if (file.children) {
        const foundChild = BrowserUtils.searchNaive(path, file.children)
  
        if (foundChild) {
          return foundChild
        }
      }
    }
  }
}