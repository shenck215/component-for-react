import * as React from 'react';
import * as classnames from 'classnames';

export interface PagaProps {
  /** 点击上一年的事件 */
  prevYear: Function;
  /** 点击下一年的事件 */
  nextYear: Function;
  /** 点击上一月的事件 */
  prevMonth: Function;
  /** 点击上一月的事件 */
  nextMonth: Function;
  /** 是否开启年快速选择功能 */
  selectYear: boolean;
  /** 是否开始月快速选择功能 */
  selectMonth: boolean;
  /** 是否展开月快速选择面板 */
  showYearQuickSelect: boolean;
  /** 是否展开月快速选择面板 */
  showMonthQuickSelect: boolean;
  year: number;
  month: number;
  /** 选择年的时间 */
  onSelectYear: Function;
  /** 选择月的时间 */
  onSelectMonth: Function;
}

export default class CalendarHeader extends React.Component<PagaProps, {}> {
  onSelectYear = () => {
    const { selectYear, onSelectYear } = this.props;
    selectYear && onSelectYear && onSelectYear(true);
  };

  onSelectMonth = () => {
    const { selectMonth, onSelectMonth } = this.props;
    selectMonth && onSelectMonth && onSelectMonth(true);
  };

  render() {
    const {
      prevYear,
      nextYear,
      prevMonth,
      nextMonth,
      selectYear,
      selectMonth,
      showYearQuickSelect,
      showMonthQuickSelect,
      year,
      month,
    } = this.props;
    const className = 'nextlc-calendar-header'
    return (
      <div className={className}>
        <span style={{ display: 'flex' }}>
          {!showYearQuickSelect && (
            <i
              className={`nextlc nextlc-angle-double-left ${className}--doubleLeft`}
              onClick={() => prevYear()}
            />
          )}
          {!showMonthQuickSelect && (
            <i className={`nextlc nextlc-angle-left ${className}--left`} onClick={() => prevMonth()} />
          )}
        </span>
        <span className={`${className}--dateInfo`}>
          <span
            className={classnames(`${className}--dateInfo--year`, selectYear ? `${className}--dateInfo--yearSelect` : '')}
            onClick={this.onSelectYear}
          >
            <span style={{ fontWeight: 'bold' }}>{year}</span>年
          </span>
          <span
            className={classnames(`${className}--dateInfo--month`, selectMonth ? `${className}--dateInfo--monthSelect` : '')}
            onClick={this.onSelectMonth}
          >
            <span style={{ fontWeight: 'bold' }}>{month + 1}</span>月
          </span>
        </span>
        <span style={{ display: 'flex' }}>
          {!showMonthQuickSelect && (
            <i className={`nextlc nextlc-angle-right ${className}--right`} onClick={() => nextMonth()} />
          )}
          {!showYearQuickSelect && (
            <i
              className={`nextlc nextlc-angle-double-right ${className}--doubleRight`}
              onClick={() => nextYear()}
            />
          )}
        </span>
      </div>
    );
  }
}
