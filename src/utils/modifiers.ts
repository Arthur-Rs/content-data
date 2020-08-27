import {IAnyObject} from '../interfaces/other'
import { getByDinamic } from './processing'

function getObject(value: string): object{
  const strObject = value.replace(/\{|\}/g, '').trim()
  const arrObject = strObject.split(',')


  const object:IAnyObject = {};
  arrObject.forEach(obj => {
    const [key, value] = obj.split(':')
    object[key.trim()] = getByDinamic(value.trim())
  })

  return object
}

function getString(value: string):string {
  return value.toString().trim().replace(/\"|\'/g, '');
}

function getNumber(value: string):number {
  return Number(value);
}

function getArray(value: string):any[] {
  let content = value.replace(/^\[|\]$/g, '')
  let objects = []
  let arrays = []

  while(
    content.indexOf('{') !==  -1 || 
    content.indexOf('}') !==  -1
    ){
    const start = content.indexOf('{')
    const end = content.indexOf('}')
    const obj = content.slice(start, end + 1)
    content = content.replace(obj, '')
    objects.push(getObject(obj))
  }

  while(
    content.indexOf('[') !==  -1 || 
    content.indexOf(']') !==  -1
    ){
    const start = content.indexOf('[')
    const end = content.indexOf(']')
    const _arr = content.slice(start, end + 1)
    content = content.replace(_arr, '')
    arrays.push(getArray(_arr))
  }

  const arr = content.split(',')
  const arrWithTypes = arr
  .filter(index => (index.trim()))
  .map(index => {
    return getByDinamic(index.trim())
  });

  const currentArray = [...arrWithTypes, ...objects, ...arrays]
  return currentArray
}

export { getObject, getString, getArray, getNumber }
