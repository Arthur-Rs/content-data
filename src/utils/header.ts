const readHeader = (header:string):Array<string> => {
  const content = header.replace(/@/g, '')
  return content.split('=')
};

export { readHeader };
