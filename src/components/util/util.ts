import * as dayjs from "dayjs";
import {
  EventFunction,
  WaitNumber,
  ImmediateType,
  searchResultArr,
  searchSourceData
} from "./baseType";

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
    if (
      dayjs(dayjs(newDate).format("YYYY-MM-DD")).unix() ===
      dayjs(diffArr[diffIndex][0]).unix()
    ) {
      diffArr[diffIndex][1] = item;
      newIndex += 1;
      return;
    }

    diffIndex += 1;
    diffArr[diffIndex] = [item, item];
    newIndex = 1;
  });

  const formatMD = (d: string) => dayjs(d).format("MM-DD");

  const dateString = diffArr
    .map(item => {
      if (item[0] === item[1]) {
        return formatMD(item[0]);
      }
      return `${formatMD(item[0])}至${formatMD(item[1])}`;
    })
    .join(",");

  return dateString;
};

/** 1 -> 01 */
export const formatNumber = (n: string | number) => {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
};

/** 去抖 */
export const debounce = (
  fn: EventFunction,
  wait: WaitNumber,
  immediate: ImmediateType = false
) => {
  let timer,
    startTimeStamp = 0;
  let context, args;

  const run = timerInterval => {
    timer = setTimeout(() => {
      const now = new Date().getTime();
      const interval = now - startTimeStamp;
      if (interval < timerInterval) {
        // the timer start time has been reset，so the interval is less than timerInterval
        startTimeStamp = now;
        run(timerInterval - interval); // reset timer for left time
      } else {
        if (!immediate) {
          fn.apply(context, args);
        }
        clearTimeout(timer);
        timer = null;
      }
    }, timerInterval);
  };

  return function() {
    context = this;
    args = arguments;
    const now = new Date().getTime();
    startTimeStamp = now; // set timer start time

    if (!timer) {
      if (immediate) {
        fn.apply(context, args);
      }
      run(wait); // last timer alreay executed, set a new timer
    }
  };
};

/** 节流 */
export const throttling = (
  fn: EventFunction,
  wait: WaitNumber,
  immediate: ImmediateType = false
) => {
  let timer;
  let context, args;

  const run = () => {
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      clearTimeout(timer);
      timer = null;
    }, wait);
  };

  return function() {
    context = this;
    args = arguments;
    if (!timer) {
      if (immediate) {
        fn.apply(context, args);
      }
      run();
    }
  };
};

/**
 * [parseAddress 分解json地址]
 * @param  {} data [description]
 * @return {[type]}      [description]
 */
export const parseAddress: (
  data: Object,
  max: number
) => { addressMap: Map<any, any>[]; addressMapSearch: any[] } = (data, max) => {
  console.time("selectCity: parseAddress run times");
  let addressMap: Map<any, any>[] = [];
  let index = 0;
  let addressMapSearch: any[] = [];
  let parentIds: { area: string; value: string | number }[] = [];
  const fn = (data: any, value?: any) => {
    data.forEach((v: any, i: number) => {
      let area = v.area;
      let list = v.list;
      let parentId: any;

      if (value !== undefined) {
        parentId = value;
      }
      if (list) {
        list.forEach((v: any, i: number) => {
          let name = v.name;
          let value = parseInt(v.value, 10);
          const { totalPY, firstOfAll } = v;

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

            let obj = addressMap[index].get(area) || {};

            if (obj[area]) {
              obj[area][value] = { name, totalPY, firstOfAll };
            } else {
              obj[area] = {};
              obj[area][value] = { name, totalPY, firstOfAll };
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
            let obj = addressMap[index].get(parentId) || {};

            if (obj[area]) {
              obj[area][value] = { name, totalPY, firstOfAll };
            } else {
              obj[area] = {};
              obj[area][value] = { name, totalPY, firstOfAll };
            }

            addressMap[index].set(parentId, obj);
          }

          /* 递归children */
          let children = v.children;

          let newParentIds: any[] = [];
          parentIds.forEach(value => {
            newParentIds.push(value);
          });
          if (index <= max) {
            addressMapSearch.push({
              name,
              totalPY,
              firstOfAll,
              parentIds: newParentIds,
              value
            });
          }

          // addressMapSearch.push(`${name}|${totalPY}|${firstOfAll}|${parentIds.length > 0 ? `${parentIds.join('|')}|`:''}${value}`);
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
  console.timeEnd("selectCity: parseAddress run times");
  return {
    addressMap,
    addressMapSearch
  };
};

export const matchSearch = (
  q: string,
  searchSource: searchSourceData[],
  addressMap: any[],
  deepMap: any[]
) => {
  let searchResult = {
    length: 0
  };
  /**
   * 小写
   */
  q = q.toLocaleLowerCase();
  console.time("mathQ");
  searchSource.forEach(data => {
    const { firstOfAll, name, totalPY } = data;
    /**
     * 匹配首字母，
     * 简拼，
     * 全拼
     */
    if (
      firstOfAll.startsWith(q) ||
      name.startsWith(q) ||
      totalPY.startsWith(q)
    ) {
      const newData = getMatchData(data, addressMap, deepMap);
      newData.forEach((element: any[]) => {
        let key: number[] = [];
        let newElement = {};
        element.forEach((data, index) => {
          key.push(data.value);
          newElement[index] = data;
        });
        if (!Object.prototype.hasOwnProperty.call(searchResult, key)) {
          searchResult[key.join("|")] = newElement;
          searchResult.length++;
        }
      });
    }
  });
  console.timeEnd("mathQ");
  console.log(searchResult);
  if (searchResult.length === 0) {
    return [];
  }
  let searchResultArr: searchResultArr[] = [];
  for (let key in searchResult) {
    if (key !== "length") {
      searchResultArr.push(searchResult[key]);
    }
  }
  return searchResultArr;
};

const getMatchData = (
  data: searchSourceData,
  addressMap: Map<any, any>[],
  deepMap: any[]
) => {
  const { parentIds } = data;
  const selfValue = data.value;
  let index = parentIds.length;
  let arr: any[] = [];
  const deepGetMatchData = (id: number, initArr: {}[] = []) => {
    index++;
    if (index > 2) {
      arr.push(initArr.slice(0, initArr.length));
      initArr.pop();
      return index--;
    }
    const children = addressMap[index].get(id);
    for (let key in children) {
      const tempData = children[key];
      if (Object.prototype.toString.call(tempData) === "[object Object]") {
        for (let key2 in tempData) {
          initArr.push({
            ...tempData[key2],
            value: parseInt(key2, 10)
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
        value: value2
      };
      const newData = { ...data };
      delete newData.parentIds;
      arr.push([parent, parent2, newData]);
      break;
    }
    default: {
      throw new Error("invalid index of parentIds at function getMatchData");
    }
  }
  return arr;
};

/**
 * parseAddressName 按照id解析中文地址
 * @param  {Array} data 对应的id
 * @param  {Map} map  对照的Map
 * @return {Array}      中文地址
 */
export const parseAddressName: (
  data: any[],
  map: Array<Map<any, any>>
) => string[] = (data, map) => {
  if (data.length <= 0) return [];
  let arr = data.map((v, i) => {
    if (i === 0) {
      for (let val of map[i].values()) {
        for (let key in val) {
          let obj = val[key];
          if (obj[v]) {
            return obj[v].name;
          }
        }
      }
    } else {
      let id = data[i - 1];
      let obj = map[i].get(id);
      for (let key in obj) {
        let obj2 = obj[key];
        if (obj2[v]) {
          return obj2[v].name;
        }
      }
    }
  });

  return arr;
};

let throttleTimer: any;
export const throttle = (fn: any, delay: number) => {
  return () => {
    clearTimeout(throttleTimer);
    throttleTimer = setTimeout(() => {
      fn();
    }, delay);
  };
};
