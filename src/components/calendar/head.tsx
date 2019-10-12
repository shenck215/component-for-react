import React from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';

interface PagaProps {
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

    return (
      <div className='nextlc-calendar-header'>
        <span style={{ display: 'flex' }}>
          {!showYearQuickSelect && (
            <Icon
              className='doubleLeft'
              key="double-left"
              type="double-left"
              onClick={() => prevYear()}
            />
          )}
          {!showMonthQuickSelect && (
            <span className='left' key="left" onClick={() => prevMonth()}>
              ‹
            </span>
          )}
        </span>
        <span className='dateInfo'>
          <span
            className={classnames('year', selectYear ? 'yearSelect' : '')}
            onClick={this.onSelectYear}
          >
            <span style={{ fontWeight: 'bold' }}>{year}</span>年
          </span>
          <span
            className={classnames('month', selectMonth ? 'monthSelect' : '')}
            onClick={this.onSelectMonth}
          >
            <span style={{ fontWeight: 'bold' }}>{month + 1}</span>月
          </span>
        </span>
        <span style={{ display: 'flex' }}>
          {!showMonthQuickSelect && (
            <span className='right' key="right" onClick={() => nextMonth()}>
              ›
            </span>
          )}
          {!showYearQuickSelect && (
            <Icon
              className='doubleRight'
              key="double-right"
              type="double-right"
              onClick={() => nextYear()}
            />
          )}
        </span>
      </div>
    );
  }
}
