import { createReadStream, createWriteStream } from 'fs';
import {resolve} from 'path'

import { readHeader } from './utils/header';
import { getByType, getByDinamic } from './utils/processing'
import IAnyObject from './interfaces/any.interface';
import console from 'console';

interface IReadContent{
  contentData:object
  contentHeader:object
} 

const readContent = async <Types> (path: string):Promise<IReadContent> => {
  const rd = createReadStream(path);
  const contentData:Types | IAnyObject = {};
  const contentHeader:Types | IAnyObject = {};

  await new Promise(resolve => {
      rd.on('data', (data:string) => {
      const lines = data.toString().trim().split(/\n|;/);

      lines.forEach((content:string) => {
        if (content[0] === '@') {
          const [key, value] = readHeader(content);
          contentHeader[key] = value;
          return
        }
        
        if(content[0] === '#' || content.length < 1){
          return
        }

        const [name, value] = content.split(/=/);
        if(content.includes('->')){
          const [type, key] = name.split('->');
          const currentValue = getByType({ type, value })

          contentData[key] = currentValue;
          return
        }
        
        contentData[name] = getByDinamic(value)
      });
    });

    rd.on('end', ()=>{
      rd.close()
      resolve()
    })
  })

  return {contentData, contentHeader}
};

export { readContent };

readContent(resolve(__dirname, 'data.cd')).then(({contentData, contentHeader})=>{
  console.log(contentData)
});


