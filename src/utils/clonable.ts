import isFunction from './isFunction';
import { isObjectType } from './isObject';

/**
 * When an object implements this interface we delegate to the clone
 * method it expose. This is a simple way to provide an escape hatch
 * for objects which require complex logic to generate a copy of themself.
 */
export interface Clonable<T> {
  clone(): T;
}

/**
 * Type guard for the Clonable interface.
 * @param obj
 * @returns
 */
export const isClonable = (obj: any): obj is Clonable<any> => {
  return isObjectType(obj) && isFunction(obj.clone);
};
