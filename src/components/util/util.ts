import dayjs from "dayjs";
import { EventFunction, WaitNumber, ImmediateType } from './baseType'

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
export const debounce = (fn: EventFunction, wait: WaitNumber, immediate: ImmediateType = false) => {
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
export const throttling = (fn: EventFunction, wait: WaitNumber, immediate: ImmediateType = false) => {
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
