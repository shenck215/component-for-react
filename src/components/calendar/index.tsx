import * as React from 'react';
import * as classnames from 'classnames';
import { dateToString, formatNumber } from '../util/util';
import CalendarHeader from './head';
import CalendarBody from './body';
import CalendarFooter from './footer';

export interface PageProps {
  wrapperClassName?: string;
  /** 默认选中的日期 */
  defaultDates?: string[];
  /** 是否开启年快速选择功能 */
  selectYear?: boolean;
  /** 是否开始月快速选择功能 */
  selectMonth?: boolean;
  /** 是否多选 */
  multiple?: boolean;
  /** 选择日期回调 */
  onDayClick?: (res: { dates: string[]; dateString: string }) => void;
  /** 最小可选日期 */
  minDate?: string;
  /** 最大可选日期 */
  maxDate?: string;
}

export interface PageStates {
  yearRangeCount: number;
  year: number;
  month: number;
  day: number;
  dates: string[];
  /** 是否开启年快速选择功能 */
  selectYear: boolean;
  /** 是否开始月快速选择功能 */
  selectMonth: boolean;
  showYearSelect: boolean;
  showMonthSelect: boolean;
  showYearQuickSelect: boolean;
  showMonthQuickSelect: boolean;
}

const displayDaysPerMonth = (year: number) => {
  // 定义每个月的天数，如果是闰年第二月改为29天
  const daysInMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }

  // 以下为了获取一年中每一个月在日历选择器上显示的数据，
  // 从上个月开始，接着是当月，最后是下个月开头的几天

  // 定义一个数组，保存上一个月的天数
  const daysInPreviousMonth: number[] = ([] as number[]).concat(daysInMonth);
  daysInPreviousMonth.unshift(daysInPreviousMonth.pop() || 31);

  // 获取每一个月显示数据中需要补足上个月的天数
  const addDaysFromPreMonth = new Array(12).fill(null).map((item, index) => {
    const day = new Date(year, index, 1).getDay();
    if (day === 0) {
      return 6;
    } else {
      return day - 1;
    }
  });

  // 已数组形式返回一年中每个月的显示数据,每个数据为6行*7天
  return new Array(12).fill([]).map((month, monthIndex) => {
    let addDays = addDaysFromPreMonth[monthIndex];
    const daysCount = daysInMonth[monthIndex];
    let daysCountPrevious = daysInPreviousMonth[monthIndex];
    const monthData: number[] = [];
    // 补足上一个月
    for (; addDays > 0; addDays--) {
      monthData.unshift(daysCountPrevious--);
    }
    // 添入当前月
    for (let i = 0; i < daysCount; ) {
      monthData.push(++i);
    }
    // 补足下一个月
    for (let i = 42 - monthData.length, j = 0; j < i; ) {
      monthData.push(++j);
    }
    return monthData;
  });
};

const monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const monthMap = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月',
};

export default class Calendar extends React.Component<PageProps, PageStates> {
  static defaultProps = {
    wrapperClassName: '',
    defaultDates: [],
    selectYear: true,
    selectMonth: true,
    multiple: false,
    minDate: '',
    maxDate: '',
  };

  constructor(props: PageProps) {
    super(props);
    const now = new Date();
    const { defaultDates, selectYear, selectMonth } = props;
    this.state = {
      yearRangeCount: 0,
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      dates: defaultDates || [],
      selectYear: selectYear || false,
      selectMonth: selectMonth || false,
      showYearSelect: false,
      showMonthSelect: false,
      showYearQuickSelect: false,
      showMonthQuickSelect: false,
    };
  }

  // 选择年
  onSelectYear = () => {
    const { showYearQuickSelect: oldShowYearQuickSelect } = this.state;
    this.setState({
      showYearQuickSelect: !oldShowYearQuickSelect,
      yearRangeCount: 0,
    });
  };

  // 选择月
  onSelectMonth = () => {
    const { showMonthQuickSelect: oldShowMonthQuickSelect } = this.state;
    this.setState({
      showMonthQuickSelect: !oldShowMonthQuickSelect,
    });
  };

  // 切换上一年范围
  prevYearQuick = () => {
    const { yearRangeCount } = this.state;
    this.setState({
      yearRangeCount: yearRangeCount - 1,
    });
  };

  // 切换下一年范围
  nextYearQuick = () => {
    const { yearRangeCount } = this.state;
    this.setState({
      yearRangeCount: yearRangeCount + 1,
    });
  };

  // 切换到下一年
  nextYear = () => {
    const { year } = this.state;
    this.setState({
      year: year + 1,
    });
  };

  // 切换到上一年
  prevYear = () => {
    const { year } = this.state;
    this.setState({
      year: year - 1,
    });
  };

  // 切换到下一个月
  nextMonth = (day: number) => {
    const { year, month } = this.state;
    if (month === 11) {
      this.setState(
        {
          year: year + 1,
          month: 0,
        },
        () => {
          const { year: rYear, month: rMonth } = this.state;
          if (day || day === 0) {
            const dateString = `${rYear}-${formatNumber(rMonth + 1)}-${formatNumber(day)}`;
            this.recordDates(dateString);
          }
        }
      );
    } else {
      this.setState(
        {
          month: month + 1,
        },
        () => {
          const { year: rYear, month: rMonth } = this.state;
          if (day || day === 0) {
            const dateString = `${rYear}-${formatNumber(rMonth + 1)}-${formatNumber(day)}`;
            this.recordDates(dateString);
          }
        }
      );
    }
  };

  // 切换到上一个月
  prevMonth = (day: number) => {
    const { year, month } = this.state;
    if (month === 0) {
      this.setState(
        {
          year: year - 1,
          month: 11,
        },
        () => {
          const { year: rYear, month: rMonth } = this.state;
          if (day || day === 0) {
            const dateString = `${rYear}-${formatNumber(rMonth + 1)}-${formatNumber(day)}`;
            this.recordDates(dateString);
          }
        }
      );
    } else {
      this.setState(
        {
          month: month - 1,
        },
        () => {
          const { year: rYear, month: rMonth } = this.state;
          if (day || day === 0) {
            const dateString = `${rYear}-${formatNumber(rMonth + 1)}-${formatNumber(day)}`;
            this.recordDates(dateString);
          }
        }
      );
    }
  };

  // 选择年份
  changeYear = (year: number) => {
    this.setState({
      year,
      showYearQuickSelect: false,
      yearRangeCount: 0,
    });
  };

  // 选择月份
  changeMonth = (month: number) => {
    this.setState({
      month,
      showMonthQuickSelect: false,
    });
  };

  // 选择日期
  datePick = (day: number) => {
    this.setState({ day }, () => {
      const { year, month } = this.state;
      const dateString = `${year}-${formatNumber(month + 1)}-${formatNumber(day)}`;
      this.recordDates(dateString);
    });
  };

  // 记录所有选中的日期
  recordDates = (dateString: string) => {
    const { multiple } = this.props;
    if (multiple) {
      const { dates } = this.state;
      if (dates.indexOf(dateString) > -1) {
        dates.splice(dates.indexOf(dateString), 1);
      } else {
        dates.push(dateString);
      }
      this.setState(
        {
          dates,
        },
        () => {
          const { dates: newDates } = this.state;
          this.recordDatesCallback(newDates);
        }
      );
    } else {
      this.setState(
        {
          dates: [dateString],
        },
        () => {
          const { dates: newDates } = this.state;
          this.recordDatesCallback(newDates);
        }
      );
    }
  };

  recordDatesCallback = (dates: string[]) => {
    const { onDayClick } = this.props;

    const dateString = dateToString(dates);

    onDayClick && onDayClick({ dates, dateString });
  };

  /** 获取年份选择区间 */
  getYearSelectRange = () => {
    const { year, yearRangeCount } = this.state;
    const rangeStartYear = Math.floor(year / 12) * 12 + yearRangeCount * 12;
    const yearArray: { index: number; year: number; isSelect: boolean }[] = [];
    for (let i = 0; i < 12; i++) {
      yearArray.push({
        index: i,
        year: rangeStartYear + i,
        isSelect: rangeStartYear + i === year,
      });
    }
    return yearArray;
  };

  render() {
    const { year, month, day, dates, selectYear, selectMonth, showMonthQuickSelect, showYearQuickSelect } = this.state;
    const { wrapperClassName, minDate, maxDate } = this.props;
    const props = {
      minDate,
      maxDate,
      viewData: displayDaysPerMonth(year),
      datePicked: `${year} 年
                   ${month + 1} 月
                   ${day} 日`,
    };
    const className = 'xbzoom-calendar';
    const yearArray = this.getYearSelectRange();
    return (
      <div
        className={classnames({
          [className]: true,
          [wrapperClassName || '']: wrapperClassName,
        })}>
        {showYearQuickSelect && (
          <div className={`${className}--yearSelect`}>
            {yearArray.map((item) => (
              <span className={`${className}--yearSelect--yearTd`} key={item.index}>
                <span
                  className={classnames(
                    `${className}--yearSelect--yearTd--yearItem`,
                    item.isSelect ? `${className}--yearSelect--yearTd--yearItem--active` : ''
                  )}
                  onClick={() => this.changeYear(item.year)}>
                  {item.year}
                </span>
              </span>
            ))}
          </div>
        )}
        {showMonthQuickSelect && (
          <div className={`${className}--monthSelect`}>
            {monthArray.map((item) => (
              <span className={`${className}--monthSelect--monthTd`} key={item}>
                <span
                  className={classnames(
                    `${className}--monthSelect--monthTd--monthItem`,
                    month + 1 === item ? `${className}--monthSelect--monthTd--monthItem--active` : ''
                  )}
                  onClick={() => this.changeMonth(item - 1)}>
                  {monthMap[item]}
                </span>
              </span>
            ))}
          </div>
        )}
        <div className={`${className}--main`}>
          <CalendarHeader
            prevYearQuick={this.prevYearQuick}
            prevYear={this.prevYear}
            prevMonth={this.prevMonth}
            nextYearQuick={this.nextYearQuick}
            nextYear={this.nextYear}
            nextMonth={this.nextMonth}
            selectYear={selectYear}
            selectMonth={selectMonth}
            onSelectYear={this.onSelectYear}
            onSelectMonth={this.onSelectMonth}
            showYearQuickSelect={showYearQuickSelect}
            showMonthQuickSelect={showMonthQuickSelect}
            year={year}
            month={month}
          />
          <CalendarBody
            {...props}
            prevMonth={this.prevMonth}
            nextMonth={this.nextMonth}
            datePick={this.datePick}
            year={year}
            month={month}
            dates={dates}
          />
          <CalendarFooter />
        </div>
      </div>
    );
  }
}
