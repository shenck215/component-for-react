import dayjs from 'dayjs'

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
      dayjs(dayjs(newDate).format('YYYY-MM-DD')).unix() === dayjs(diffArr[diffIndex][0]).unix()
    ) {
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
    .map(item => {
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