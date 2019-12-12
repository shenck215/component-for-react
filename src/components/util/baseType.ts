/** 防抖动 节流阀 参数options */
export type debounceOptionType = {
  /** 指定在延迟开始前调用 默认值false */
  leading?: boolean;
  /** 允许被延迟的最大值 */
  maxWait?: number;
  /** 指定在延迟结束后调用 默认值true */
  trailing?: boolean;
};
export type throttleOptionType = {
  /** 指定调用在节流开始前 默认值true */
  leading?: boolean;
  /** 指定调用在节流开始后 默认值true */
  trailing?: boolean;
};
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
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = <T extends string[]>(...args: T) => args;

export const tupleNum = <T extends number[]>(...args: T) => args;

interface BaseSyntheticEvent<E = object, C = any, T = any> {
  nativeEvent: E;
  currentTarget: C;
  target: T;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  timeStamp: number;
  type: string;
}

type NativeMouseEvent = Event;

type EventHandler<E extends SyntheticEvent> = { bivarianceHack(event: E): void }['bivarianceHack'];

type SyntheticEvent = BaseSyntheticEvent<any, any, EventTarget>;

interface MouseEvent<T = Element, E = NativeMouseEvent> extends SyntheticEvent {
  altKey: boolean;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  /**
   * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
   */
  getModifierState(key: string): boolean;
  metaKey: boolean;
  movementX: number;
  movementY: number;
  pageX: number;
  pageY: number;
  relatedTarget: EventTarget;
  screenX: number;
  screenY: number;
  shiftKey: boolean;
}

export type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
