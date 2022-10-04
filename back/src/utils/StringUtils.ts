const trim = (str: string, ch: string): string => {
  var start = 0, 
      end = str.length;

  while(start < end && str[start] === ch)
      ++start;

  while(end > start && str[end - 1] === ch)
      --end;

  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

const rtrim = (str: string, ch: string): string => {
  var end = str.length;

  while(end > 0 && str[end - 1] === ch)
      --end;

  return (end < str.length) ? str.substring(0, end) : str;
}

const ltrim = (str: string, ch: string): string => {
  var start = 0, 
      end = str.length;

  while(start < end && str[start] === ch)
    ++start;

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
  }).filter(x=>x.length).join('/')
}

export const StringUtils = {
  trim,
  ltrim,
  rtrim,
  pathJoin
}