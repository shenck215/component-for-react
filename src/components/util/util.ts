import * as dayjs from 'dayjs';
import { debounceOptionType, throttleOptionType, searchResultArr, searchSourceData } from './baseType';

/** 划分日期区间 */
export const dateToString = (dates: string[]) => {
  const newDates = dates.sort();

  const diffArr: string[][] = [];
  let diffIndex = 0;
  let newIndex = 1;

  newDates.forEach((item, i) => {
    if (Number(i) === 0) {
      diffArr[diffIndex] = [item, item];
      return;
    }

    const d = new Date(item);
    const newDate = d.setDate(d.getDate() - newIndex);
    if (dayjs(dayjs(newDate).format('YYYY-MM-DD')).unix() === dayjs(diffArr[diffIndex][0]).unix()) {
      diffArr[diffIndex][1] = item;
      newIndex += 1;
      return;
    }

    diffIndex += 1;
    diffArr[diffIndex] = [item, item];
    newIndex = 1;
  });

  const formatMD = (d: string) => dayjs(d).format('MM-DD');

  const dateString = diffArr
    .map((item) => {
      if (item[0] === item[1]) {
        return formatMD(item[0]);
      }
      return `${formatMD(item[0])}至${formatMD(item[1])}`;
    })
    .join(',');

  return dateString;
};

/** 1 -> 01 */
export const formatNumber = (n: string | number) => {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
};

export const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
};

/** 从Node.js中检测变量global */
const freeGlobal = typeof global === 'object' && global !== null && global.Object === Object && global;

/** 检测变量globalThis */
const freeGlobalThis =
  typeof globalThis === 'object' && globalThis !== null && globalThis.Object == Object && globalThis;

/** 检测变量self */
const freeSelf = typeof self === 'object' && self !== null && self.Object === Object && self;

/** 用作对全局对象的引用 */
const root = freeGlobalThis || freeGlobal || freeSelf || Function('return this')();

/**
 * 创建一个 debounced（防抖动）函数，该函数会从上一次被调用后，延迟 wait 毫秒后调用 func 方法。 debounced（防抖动）函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options（选项） 对象决定如何调用 func 方法，options.leading 与|或 options.trailing 决定延迟前后如何触发（是 先调用后等待 还是 先等待后调用）。 func 调用时会传入最后一次提供给 debounced（防抖动）函数 的参数。 后续调用的 debounced（防抖动）函数返回是最后一次 func 调用的结果。
 * 注意: 如果 leading 和 trailing 选项为 true, 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用防抖方法。
 * 如果 wait 为 0 并且 leading 为 false, func调用将被推迟到下一个点，类似setTimeout为0的超时。
 */
export const debounce = (func: Function, wait: number, options: debounceOptionType = {}) => {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;

  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = !wait && wait !== 0 && typeof root.requestAnimationFrame === 'function';

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId);
      return root.requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id);
    }
    clearTimeout(id);
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
};

/**
 * 创建一个节流函数，在 wait 秒内最多执行 func 一次的函数。 该函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options 对象决定如何调用 func 方法， options.leading 与|或 options.trailing 决定 wait 前后如何触发。 func 会传入最后一次传入的参数给这个函数。 随后调用的函数返回是最后一次 func 调用的结果。
 * 注意: 如果 leading 和 trailing 都设定为 true 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用。
 * 如果 wait 为 0 并且 leading 为 false, func调用将被推迟到下一个点，类似setTimeout为0的超时。
 */
export const throttle = (func: Function, wait: number, options: throttleOptionType = {}) => {
  let leading = true;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
};

/**
 * [parseAddress 分解json地址]
 * @param  {} data [description]
 * @return {[type]}      [description]
 */
export const parseAddress: (
  data: Record<string, any>,
  max: number
) => { addressMap: Map<any, any>[]; addressMapSearch: any[] } = (data, max) => {
  const addressMap: Map<any, any>[] = [];
  let index = 0;
  const addressMapSearch: any[] = [];
  const parentIds: { area: string; value: string | number }[] = [];
  const fn = (data: any, value?: any) => {
    data.forEach((v: any, i: number) => {
      const area = v.area;
      const list = v.list;
      let parentId: any;

      if (value !== undefined) {
        parentId = value;
      }
      if (list) {
        list.forEach((v: any, i: number) => {
          const name = v.name;
          const value = parseInt(v.value, 10);
          const { pinyin, py } = v;

          /* 创建对应的哈希表 */
          if (addressMap[index] === undefined) {
            addressMap.push(new Map());
          }

          /* 如果是第一级 */
          if (index === 0) {
            /**
             * 设置Map对象，格式如下
             * {
             * 'A-D':
             *    {
             *     'A-D': {
             *        1: "浙江"
             *        }
             *     }
             *  }
             */

            const obj = addressMap[index].get(area) || {};

            if (obj[area]) {
              obj[area][value] = { name, pinyin, py };
            } else {
              obj[area] = {};
              obj[area][value] = { name, pinyin, py };
            }

            addressMap[index].set(area, obj);
          } else {
            /* 如果是不是第一级 */
            /**
             * 设置Map对象，格式如下
             * 1对象上一级的id，类似parentId
             * {
             *   1: {
             *    'A-D': {
             *        2: "杭州"
             *     }
             *   }
             * }
             */
            const obj = addressMap[index].get(parentId) || {};

            if (obj[area]) {
              obj[area][value] = { name, pinyin, py };
            } else {
              obj[area] = {};
              obj[area][value] = { name, pinyin, py };
            }

            addressMap[index].set(parentId, obj);
          }

          /* 递归children */
          const children = v.children;

          const newParentIds: any[] = [];
          parentIds.forEach((value) => {
            newParentIds.push(value);
          });
          if (index <= max) {
            addressMapSearch.push({
              name,
              pinyin,
              py,
              parentIds: newParentIds,
              value,
            });
          }

          // addressMapSearch.push(`${name}|${pinyin}|${py}|${parentIds.length > 0 ? `${parentIds.join('|')}|`:''}${value}`);
          if (children && children.length > 0) {
            parentIds.push({ area, value });
            index++;
            fn(children, value);
          }
        });
      }
    });
    index--;
    parentIds.pop();
  };

  fn(data);

  return {
    addressMap,
    addressMapSearch,
  };
};

export const matchSearch = (q: string, searchSource: searchSourceData[], addressMap: any[], deepMap: any[]) => {
  const searchResult = {
    length: 0,
  };
  /**
   * 小写
   */
  q = q.toLocaleLowerCase();

  searchSource.forEach((data) => {
    const getMatchData = (data: searchSourceData, addressMap: Map<any, any>[], deepMap: any[]) => {
      const { parentIds } = data;
      const selfValue = data.value;
      let index = parentIds.length;
      const arr: any[] = [];
      const deepGetMatchData = (id: number, initArr: {}[] = []) => {
        index++;
        if (index > 2) {
          arr.push(initArr.slice(0, initArr.length));
          initArr.pop();
          return index--;
        }
        const children = addressMap[index].get(id);
        for (const key in children) {
          const tempData = children[key];
          if (Object.prototype.toString.call(tempData) === '[object Object]') {
            for (const key2 in tempData) {
              initArr.push({
                ...tempData[key2],
                value: parseInt(key2, 10),
              });
              deepGetMatchData(parseInt(key2, 10), initArr);
            }
          }
        }
        initArr.pop();
        index--;
        return;
      };
      switch (index) {
        //一级
        case 0: {
          const parent = { ...data };
          delete parent.parentIds;
          deepGetMatchData(selfValue, [parent]);
          break;
        }
        //二级
        case 1: {
          const { area, value } = parentIds[0];
          const parent = { ...addressMap[0].get(area)[area][value], value };
          const parent2 = { ...data };
          delete parent2.parentIds;
          deepGetMatchData(selfValue, [parent, parent2]);
          break;
        }
        //三级
        case 2: {
          const { area, value } = parentIds[0];
          const parent = { ...addressMap[0].get(area)[area][value], value };
          const area2 = parentIds[1].area;
          const value2 = parentIds[1].value;
          const parent2 = {
            ...addressMap[1].get(value)[area2][value2],
            value: value2,
          };
          const newData = { ...data };
          delete newData.parentIds;
          arr.push([parent, parent2, newData]);
          break;
        }
        default: {
          throw new Error('invalid index of parentIds at function getMatchData');
        }
      }
      return arr;
    };
    let { py, name, pinyin } = data;
    py = py ? py.toLocaleLowerCase() : '';
    name = name ? name.toLocaleLowerCase() : '';
    pinyin = pinyin ? pinyin.toLocaleLowerCase() : '';
    /**
     * 匹配首字母，
     * 简拼，
     * 全拼
     */
    if (py.startsWith(q) || name.startsWith(q) || pinyin.startsWith(q)) {
      const newData = getMatchData(data, addressMap, deepMap);
      newData.forEach((element: any[]) => {
        const key: number[] = [];
        const newElement = {};
        element.forEach((data, index) => {
          key.push(data.value);
          newElement[index] = data;
        });
        if (!Object.prototype.hasOwnProperty.call(searchResult, key)) {
          searchResult[key.join('|')] = newElement;
          searchResult.length++;
        }
      });
    }
  });

  if (searchResult.length === 0) {
    return [];
  }
  const searchResultArr: searchResultArr[] = [];
  for (const key in searchResult) {
    if (key !== 'length') {
      searchResultArr.push(searchResult[key]);
    }
  }
  return searchResultArr;
};

/**
 * parseAddressName 按照id解析中文地址
 * @param  {Array} data 对应的id
 * @param  {Map} map  对照的Map
 * @return {Array}      中文地址
 */
export const parseAddressName: (data: any[], map: Array<Map<any, any>>) => string[] = (data, map) => {
  if (data.length <= 0) return [];
  const arr = data.map((v, i) => {
    if (i === 0) {
      for (const val of map[i].values()) {
        for (const key in val) {
          const obj = val[key];
          if (obj[v]) {
            return obj[v].name;
          }
        }
      }
    } else {
      const id = data[i - 1];
      const obj = map[i].get(id);
      for (const key in obj) {
        const obj2 = obj[key];
        if (obj2[v]) {
          return obj2[v].name;
        }
      }
    }
  });

  return arr;
};

export default {
  dateToString,
  formatNumber,
  isObject,
  debounce,
  throttle,
  parseAddress,
  matchSearch,
  parseAddressName,
};
