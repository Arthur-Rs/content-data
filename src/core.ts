import { createReadStream } from 'fs';

import { readHeader } from './utils/header';
import { getByType, getByDinamic } from './utils/processing'
import { IAnyObject } from './interfaces/other';
import { IReadContent } from './interfaces/ready_functions'


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

const getVariable = async<Type>(path: string, variable: string):Promise<any> => {
  const rd = createReadStream(path);
  let variableContent:Type | any;

  await new Promise(resolve => {
      rd.on('data', (data:string) => {
      const lines = data.toString().trim().split(/\n|;/);

      lines.forEach((content:string) => {
        
        if(
          content[0] === '#' || content.length < 1 || content[0] === '@'){
          return
        }

        const [name, value] = content.split(/=/);
        if(content.includes('->')){
          const [type, key] = name.split('->');
          
          if(key === variable){
            variableContent = value
            resolve()
          }
        }
        
        if(name === variable){
          variableContent = value
          resolve()
        }
      });
    });

    rd.on('end', ()=>{
      rd.close()
      resolve()
    })
  })

  return variableContent
}

const getHeader = async<Type>(path: string, variable: string):Promise<any> => {
  const rd = createReadStream(path);
  let variableContent:Type | any;

  await new Promise(resolve => {
      rd.on('data', (data:string) => {
      const lines = data.toString().trim().split(/\n|;/);

      lines.forEach((content:string) => {
        if (content[0] !== '@') {
          return
        }

        const [key, value] = content.replace('@', '').split('=')

        if(key === variable){
          variableContent = value
          resolve()
        }
      });
    });

    rd.on('end', ()=>{
      rd.close()
      resolve()
    })
  })

  return variableContent
}

export { readContent, getVariable, getHeader };




