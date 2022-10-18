const Utils = {
  defaultTo<T>(value, def: T): T {
    return (value === null || value === undefined) ? def : value
  }
}

export default Utils
