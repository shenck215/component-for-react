import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { formatNumber } from '@/components/util/util';

interface PageProps {
  /** 选择日期的事件 */
  datePick: Function;
  /** 选择上一月的事件 */
  prevMonth: Function;
  /** 选择下一月的事件 */
  nextMonth: Function;
  /** 视窗的数据 */
  viewData: any;
  year: number;
  month: number;
  /** 选中的日期 */
  dates: string[];
  /** 最小可选日期 */
  minDate?: string;
  /** 最大可选日期 */
  maxDate?: string;
}

export default class CalendarBody extends React.Component<PageProps, {}> {
  // 处理日期选择事件，如果是当月，触发日期选择；如果不是当月，切换月份
  handleDatePick = (day: number, styleName: string, disable: boolean) => {
    if (!disable) {
      const { datePick, prevMonth, nextMonth } = this.props;
      if (styleName === 'thisMonth') {
        datePick(day);
      } else if (styleName === 'prevMonth') {
        prevMonth(day);
      } else if (styleName === 'nextMonth') {
        nextMonth(day);
      }
    }
  };

  render() {
    const { viewData, year, month, dates, minDate, maxDate } = this.props;
    // 确定当前月数据中每一天所属的月份，以此赋予不同className
    const rMonth = viewData[month];
    const rowsInMonth: number[][] = [];
    let i = 0;
    const styleOfDays = (() => {
      i = rMonth.indexOf(1);
      const j = rMonth.indexOf(1, i + 1);
      const arr = new Array(42);
      arr.fill('prevMonth', 0, i);
      arr.fill('thisMonth', i, j);
      arr.fill('nextMonth', j);
      return arr;
    })();

    // 把每一个月的显示数据以7天为一组等分
    rMonth.forEach((rday: any, index: number) => {
      if (index % 7 === 0) {
        rowsInMonth.push(rMonth.slice(index, index + 7));
      }
    });

    return (
      <table className='nextlc-calendar-body'>
        <thead>
          <tr className='week'>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
        </thead>
        <tbody>
          {rowsInMonth.map((row, rowsInMonthIndex) => {
            return (
              <tr key={`${JSON.stringify(row)}${Math.random()}`}>
                {row.map((rday, dayIndex) => {
                  const styleName = styleOfDays[rowsInMonthIndex * 7 + dayIndex];
                  let currentDateString = `${year}-${formatNumber(month + 1)}-${formatNumber(
                    rday
                  )}`;
                  if (styleName === 'prevMonth') {
                    currentDateString = `${month === 0 ? year - 1 : year}-${formatNumber(
                      month === 0 ? 12 : month
                    )}-${formatNumber(rday)}`;
                  } else if (styleName === 'nextMonth') {
                    currentDateString = `${month === 11 ? year + 1 : year}-${formatNumber(
                      month === 11 ? 1 : month + 2
                    )}-${formatNumber(rday)}`;
                  }
                  const disable =
                    (minDate &&
                      typeof minDate === 'string' &&
                      moment(currentDateString).unix() < moment(minDate).unix()) ||
                    (maxDate &&
                      typeof maxDate === 'string' &&
                      moment(currentDateString).unix() > moment(maxDate).unix());
                  return (
                    <td
                      className={classnames(
                        'dayBlock',
                        styleName,
                        currentDateString === moment().format('YYYY-MM-DD') ? 'today' : '',
                        dates.indexOf(currentDateString) > -1 ? 'active' : '',
                        disable ? 'disable' : ''
                      )}
                      onClick={() => this.handleDatePick(rday, styleName, disable || false)}
                      key={`${JSON.stringify(row)}${Math.random()}${rday}`}
                    >
                      {rday}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
