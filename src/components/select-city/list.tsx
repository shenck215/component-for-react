import * as React from 'react';
import * as classnames from 'classnames';
import { searchResultArr } from '../util/baseType';

export interface PageProps {
  searchDataSource: any[];
  selectedIndex: number;
  setInputValue: (selectVal: number[], selectName: string[]) => void;
  highlight: (data: searchResultArr) => string | any[] | JSX.Element;
  current: number;
  pageSize: number;
  totalPage: number;
  prevBtn: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  nextBtn: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** 无搜索结果提示 */
  notFoundContent?: string;
}

export default class List extends React.Component<PageProps, {}> {
  classNameForSelected = 'xbzoom-selectcity-container--list--row--active';

  renderRow = (record) => {
    const { highlight } = this.props;
    const hasName: string[] = [];
    const arr: React.ReactElement<HTMLSpanElement>[] = [];
    for (const key in record) {
      const data = record[key];
      if (!hasName.includes(data.name)) {
        hasName.push(data.name);
        arr.push(<span key={data.value}>{highlight(data)} </span>);
      }
    }
    return (
      <div>
        {Array.from(new Set(arr)).map((value, index) => {
          return (
            <span key={index}>
              {value}
              {index < arr.length - 1 ? '，' : ''}
            </span>
          );
        })}
      </div>
    );
  };

  render() {
    const {
      searchDataSource,
      selectedIndex,
      setInputValue,
      current,
      pageSize,
      totalPage,
      prevBtn,
      nextBtn,
      notFoundContent = '找不到你要的结果，换个试试',
    } = this.props;
    const className = 'xbzoom-selectcity-container--list';
    return (
      <div className={className}>
        {searchDataSource.length > 0 ? (
          <>
            {searchDataSource
              .filter((item, index) => index >= (current - 1) * pageSize && index < current * pageSize)
              .map((item, index) => (
                <div
                  key={JSON.stringify(item)}
                  className={classnames({
                    [`${className}--row`]: true,
                    [this.classNameForSelected]: selectedIndex === index,
                  })}
                  onClick={() => {
                    const selectVal: number[] = [];
                    const selectName: string[] = [];
                    for (const key in item) {
                      const data = item[key];
                      selectVal.push(data.value);
                      selectName.push(data.name);
                    }
                    setInputValue(selectVal, selectName);
                  }}>
                  {this.renderRow(item)}
                </div>
              ))}
            {totalPage > 1 && (
              <div className={`${className}--pagination`}>
                <i
                  className={`xbzoom xbzoom-angle-left ${className}--pagination--left ${
                    current === 1 ? `${className}--pagination--left--disabled` : ''
                  }`}
                  onClick={prevBtn}
                />
                {current}
                <span className={`${className}--pagination--partition`}>/</span>
                {totalPage}
                <i
                  className={`xbzoom xbzoom-angle-right ${className}--pagination--right ${
                    current === totalPage ? `${className}--pagination--right--disabled` : ''
                  }`}
                  onClick={nextBtn}
                />
              </div>
            )}
          </>
        ) : (
          <div className={`${className}--none`}>{notFoundContent}</div>
        )}
      </div>
    );
  }
}
