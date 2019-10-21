/** 防抖动 节流阀 参数options */
export type debounceOptionType = {
  /** 指定在延迟开始前调用 默认值false */
  leading?: boolean;
  /** 允许被延迟的最大值 */
  maxWait?: number;
  /** 指定在延迟结束后调用 默认值true */
  trailing?: boolean;
}
export type throttleOptionType = {
  /** 指定调用在节流开始前 默认值true */
  leading?: boolean;
  /** 指定调用在节流开始后 默认值true */
  trailing?: boolean;
}
/**
 * 模糊匹配结果
 * @param q {string} 搜索关键字
 * @param source {Array} source 数据集
 */
export type searchSourceData = {
  py: string;
  name: string;
  pinyin: string;
  value: number;
  parentIds: any[];
};

export type searchResultArr = {
  py: string;
  name: string;
  pinyin: string;
  value: number;
}