/** 触发的事件函数 */
export type EventFunction = Function;
/** 等待的事件 */
export type WaitNumber = number;
/** 是否前缘触发 */
export type ImmediateType = boolean;
/**
 * 模糊匹配结果
 * @param q {string} 搜索关键字
 * @param source {Array} source 数据集
 */
export type searchSourceData = {
  firstOfAll: string;
  name: string;
  totalPY: string;
  value: number;
  parentIds: any[];
};

export type searchResultArr = {
  firstOfAll: string;
  name: string;
  totalPY: string;
  value: number;
}