import ContentTypes from '../interfaces/types.interface'
interface IGetType{
  type:ContentTypes
  value:string
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

function getString(value: string):string {
  return value.toString().trim();
}

function getNumber(value: string):number {
  return Number(value);
}

function getArray(value: string):any[] {
  const content = value.replace(/\[|\]/g, '');
  const arr = content.split(',');
  return arr;
}


export {
  getString, getArray, getNumber,getByType
};
