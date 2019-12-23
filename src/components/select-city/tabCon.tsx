import React, { Component } from 'react';
import * as classnames from 'classnames';

export interface TabConProps {
  index: number;
  selectVal: any;
  params: any;
  addressMap: any;
  valIndex: number;
  changeState: (data: any) => void;
  clearHotCityId: Function;
}
class TabCon extends Component<TabConProps, {}> {
  constructor(props: TabConProps) {
    super(props);
    // this.displayName = 'TabCon';
  }
  getItems() {
    const className = 'xbzoom-selectcity-container--tabCon';
    let { index, selectVal, valIndex, params, addressMap } = this.props;

    /**
     * [max 最大联动的层级]
     */
    const deepMap = params.deepMap;
    const max = deepMap.length;

    /* index不能大于max */
    if (index >= max) {
      index = max - 1;
      valIndex = max - 2;
    }

    const id = selectVal[valIndex];
    let data = addressMap[index];

    const activeId = selectVal[index];

    let globalkey = 0;

    const cityItem = (val: {}) => {
      const items: JSX.Element[] = [];
      for (const key in val) {
        let active = false;
        const id = parseInt(key, 10);
        if (activeId === id) {
          active = true;
        }
        items.push(<CityItem key={++globalkey} id={id} val={val} active={active} {...this.props} />);
      }
      return items;
    };

    /* 如果是第一级不同的处理 */
    if (index === 0) {
      const tempData = {};
      for (const val of data.values()) {
        for (const key in val) {
          tempData[key] = val[key];
        }
      }
      data = tempData;
    } else {
      data = data.get(id);
    }

    /* 城市容器 */
    const items: JSX.Element[] = [];
    for (const key in data) {
      items.push(
        <div className={`${className}--citys--areaGroup`} key={++globalkey}>
          {key !== '' && key !== 'null' && key !== 'undefined' && (
            <span className={`${className}--citys--areaGroup--areaItem`}>{key}</span>
          )}
          <div className={`${className}--citys--cityGroup`}>{cityItem(data[key])}</div>
        </div>
      );
    }

    return (
      <div className={`${className}--citys`}>
        {items.length > 0 ? (
          items
        ) : (
          <div className={`${className}--citys--none`}>{`请先选择${index === 1 ? '省份' : '城市'}~`}</div>
        )}
      </div>
    );
  }
  render() {
    const items = this.getItems();
    return <div className="xbzoom-selectcity-container--tabCon">{items}</div>;
  }
}

export interface CityItemProps extends TabConProps {
  id: any;
  selectName?: any;
  val: any;
  active: any;
}
class CityItem extends Component<CityItemProps, {}> {
  constructor(props: CityItemProps) {
    super(props);
    // this.displayName = 'CityItem';
  }
  handleClick() {
    let { index, changeState, id, selectVal, valIndex, clearHotCityId } = this.props;

    /* 记录当前点击的索引，用来记录值得位置 */
    valIndex = index;

    /* 索引 + 1 */
    index++;

    /**
     * 如果点击的是第一个tabCon中的city,
     * 就清空初始化为空数组[],
     * 否则就拷贝props的selectVal
     */
    selectVal = valIndex === 0 ? [] : selectVal.concat();

    /**
     * 记录选中的id
     * 赋值对应的selectVal
     */
    selectVal[valIndex] = parseInt(id, 10);

    clearHotCityId();

    /* 更新state */
    changeState({
      index: index,
      valIndex: valIndex,
      selectVal: selectVal,
      trigger: true,
    });
  }
  render() {
    const className = 'xbzoom-selectcity-container--tabCon';
    const { id, val, active } = this.props;
    const { name } = val[id];

    const className2 = classnames({
      [`${className}--citys--cityGroup--cityItem`]: true,
      [`${className}--citys--cityGroup--cityItem--active`]: active,
    });

    return (
      <span className={className2} data-id={id} onClick={(e) => this.handleClick()}>
        {' '}
        {name}{' '}
      </span>
    );
  }
}

export default TabCon;
