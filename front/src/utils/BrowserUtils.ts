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
  },

  resolveParentLinks: (items: GuiBrowserFile[], parent?: GuiBrowserFile) => {
    for (const file of items) {
      file.parent = parent
      
      if (file.children) {
        BrowserUtils.resolveParentLinks(file.children, file)
      }
    }
  },

  deleteItem: (items: GuiBrowserFile[], toDelete: GuiBrowserFile): GuiBrowserFile[] => {
    return  items
      .filter(i => i.path !== toDelete.path)
      .map(i => {
        if (i.children) {
          return {...i, children: BrowserUtils.deleteItem(i.children, toDelete)}
        }

        return {...i}
      })
  }
}