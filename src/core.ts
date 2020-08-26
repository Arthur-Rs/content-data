import { createReadStream, createWriteStream } from 'fs';
import {resolve} from 'path'

import { readHeader } from './utils/header';
import {getByType} from './utils/processing'
import IContent from './interfaces/content.interface';

interface IReadContent{
  contentData:object
  contentHeader:object
} 

const readContent = async <Types> (path: string):Promise<IReadContent> => {
  const rd = createReadStream(path);
  const contentData:Types | IContent = {};
  const contentHeader:Types | IContent = {};

  await new Promise(resolve => {
      rd.on('data', (data:string) => {
      const lines = data.toString().split('\n');

      lines.forEach((content:string) => {
        if (content[0] === '@') {
          const [key, value] = readHeader(content);
          contentHeader[key] = value;
          return
        }

        if(content[0] === '#' || content.length < 1){
          return
        }

        const [name, value] = content.split('=');
        const [type, key] = name.split('->');

        const currentValue = getByType({ type, value })

        contentData[key] = currentValue;
      });
    });

    rd.on('end', ()=>{
      rd.close()
      resolve()
    })
  })

  return {contentData, contentHeader}
};

const writeContent = async (path: string):Promise<void> => {
  const wr = createWriteStream(path)

  await new Promise(resolve => {
    
  })
}

export { readContent };




readContent(resolve(__dirname, 'data.cd')).then(({contentData, contentHeader})=>{
  console.log({contentHeader, contentData,})
});


