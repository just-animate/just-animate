import { isOwner } from './inspect'
import { all } from './lists'

export function assign<T1>(...objs: T1[]): T1
export function assign() {
  var result = {}
  all(arguments, obj => {
    for (var name in obj) {
      if (isOwner(obj, name)) {
        result[name] = obj[name]
      }
    }
  }) 
  return result
}
