import { getArray, getNumber, getObject, getString } from './modifiers'
import { IGetType } from '../interfaces/modifiers'


function getByDinamic(value:string):any {

  const numberExp = /^\d+(?:\. \d+)?$/
  const stringExp = /^\"|^\'.\"$|\'$/
  const arrayExp = /^\[|^\(.\]$|\⁾$/
  const objExp = /^\{.|\}$/

  if(stringExp.test(value)){
    return getString(value)
  }

  if(numberExp.test(value)){
    return getNumber(value)
  }

  if(arrayExp.test(value)){
    return getArray(value)
  }

  if(objExp.test(value)){
    return getObject(value)
  }

  return getString(value)
}

function getByType({type, value}:IGetType): string | number | Array<any>{
  let currentValue:any = value;
  const currentType = type.toLowerCase().trim();

  switch(currentType){
    case ('string'):
    case ('str'):
    case ('text'):
      currentValue = getString(value)
      break
    case ('number'):
    case ('float'):
    case ('double'):
    case ('int'):
       currentValue = getNumber(value)
      break
    case ('array'):
    case ('arr'):
    case ('list'):
      currentValue = getArray(value)
      break
  }

  return currentValue
}


export { getByType, getByDinamic };
