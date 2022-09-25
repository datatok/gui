export const StringUtils = {
  trim: (str: string, ch: string): string => {
      var start = 0, 
          end = str.length;

      while(start < end && str[start] === ch)
          ++start;

      while(end > start && str[end - 1] === ch)
          --end;

      return (start > 0 || end < str.length) ? str.substring(start, end) : str;
  },

  rtrim: (str: string, ch: string): string => {
    var end = str.length;

    while(end > 0 && str[end - 1] === ch)
        --end;

    return (end < str.length) ? str.substring(0, end) : str;
}
}