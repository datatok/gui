const trim = (str: string, ch: string): string => {
  let start = 0
  let end = str.length

  while (start < end && str[start] === ch) { ++start }

  while (end > start && str[end - 1] === ch) { --end }

  return (start > 0 || end < str.length) ? str.substring(start, end) : str
}

const rtrim = (str: string, ch: string): string => {
  let end = str.length

  while (end > 0 && str[end - 1] === ch) { --end }

  return (end < str.length) ? str.substring(0, end) : str
}

const ltrim = (str: string, ch: string): string => {
  let start = 0
  const end = str.length

  while (start < end && str[start] === ch) { ++start }

  return str.substring(start, end)
}

const pathJoin = (...args): string => {
  return args.map((part, i) => {
    if (i === 0) {
      return rtrim(part, '/')
    }
    if (i === args.length - 1) {
      return ltrim(part, '/')
    }
    return trim(part, '/')
  }).filter(x => x.length).join('/')
}

export const StringUtils = {
  trim,
  ltrim,
  rtrim,
  pathJoin,
  formatBytes: (bytes: number, decimals: number) => {
    if (bytes == 0) return '0 Bytes'
    const k = 1024
    const dm = decimals || 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
}
