import * as React from 'react';
import * as classnames from 'classnames';

export interface PagaProps {
  /** 点击上一年范围的事件 */
  prevYearQuick: Function;
  /** 点击下一年范围的事件 */
  nextYearQuick: Function;
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
    selectYear && onSelectYear && onSelectYear();
  };

  onSelectMonth = () => {
    const { selectMonth, onSelectMonth, showYearQuickSelect } = this.props;
    !showYearQuickSelect && selectMonth && onSelectMonth && onSelectMonth();
  };

  render() {
    const {
      prevYearQuick,
      prevYear,
      nextYearQuick,
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
    const className = 'xbzoom-calendar-header';
    return (
      <div className={className}>
        <span style={{ display: 'flex' }}>
          {showYearQuickSelect ? (
            <i className={`xbzoom xbzoom-angle-double-left ${className}--doubleLeft`} onClick={() => prevYearQuick()} />
          ) : showMonthQuickSelect ? (
            <i className={`xbzoom xbzoom-angle-double-left ${className}--doubleLeft`} onClick={() => prevYear()} />
          ) : (
            <>
              <i className={`xbzoom xbzoom-angle-double-left ${className}--doubleLeft`} onClick={() => prevYear()} />
              <i className={`xbzoom xbzoom-angle-left ${className}--left`} onClick={() => prevMonth()} />
            </>
          )}
        </span>
        <span className={`${className}--dateInfo`}>
          <span
            className={classnames(
              `${className}--dateInfo--year`,
              selectYear ? `${className}--dateInfo--yearSelect` : ''
            )}
            onClick={this.onSelectYear}>
            <span style={{ fontWeight: 'bold' }}>{year}</span>年
          </span>
          <span
            className={classnames(
              `${className}--dateInfo--month`,
              !showYearQuickSelect && selectMonth ? `${className}--dateInfo--monthSelect` : ''
            )}
            onClick={this.onSelectMonth}>
            <span style={{ fontWeight: 'bold' }}>{month + 1}</span>月
          </span>
        </span>
        <span style={{ display: 'flex' }}>
          {showYearQuickSelect ? (
            <i
              className={`xbzoom xbzoom-angle-double-right ${className}--doubleRight`}
              onClick={() => nextYearQuick()}
            />
          ) : showMonthQuickSelect ? (
            <i className={`xbzoom xbzoom-angle-double-right ${className}--doubleRight`} onClick={() => nextYear()} />
          ) : (
            <>
              <i className={`xbzoom xbzoom-angle-right ${className}--right`} onClick={() => nextMonth()} />
              <i className={`xbzoom xbzoom-angle-double-right ${className}--doubleRight`} onClick={() => nextYear()} />
            </>
          )}
        </span>
      </div>
    );
  }
}
