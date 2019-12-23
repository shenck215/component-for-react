import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';
import { searchResultArr } from '../util/baseType';
import { ParamsProps } from './index';
import List from './list';
import Tab from './tab';
import TabCon from './tabCon';

export interface PostionContainerProps {
  matchQ: string;
  loading: boolean;
  searchDataSource: any[];
  setInputValue: (selectVal: number[], selectName: string[]) => void;
  index: number;
  selectVal: number[];
  valIndex: number;
  params: ParamsProps;
  addressMap: Map<any, any>[];
  changeState: (params: any) => void;
  input: {
    left: number;
    top: number;
    width: number | string;
  };
  show: boolean;
  searching: boolean;
  hotData: Array<{ name: string; provinceId: number; cityId: number }>;
  /** 无搜索结果提示 */
  notFoundContent?: string;
}

export interface PostionContainerStates {
  selectedIndex: number;
  current: number;
  pageSize: number;
  totalPage: number;
  selectedHotCityId: number;
}

export default class PostionContainer extends React.Component<PostionContainerProps, PostionContainerStates> {
  private _container: HTMLDivElement;
  list: List;
  constructor(props: PostionContainerProps) {
    super(props);
    const { searchDataSource, selectVal } = props;
    this.state = {
      selectedIndex: 0,
      current: 1,
      pageSize: 8,
      totalPage: Math.ceil(searchDataSource.length / 8),
      selectedHotCityId: selectVal[1] || 0,
    };
    this._container = document.createElement('div');
  }

  UNSAFE_componentWillReceiveProps(nextProps: PostionContainerProps) {
    const { searchDataSource } = nextProps;
    if (JSON.stringify(searchDataSource) !== JSON.stringify(this.props.searchDataSource)) {
      this.setState({
        selectedIndex: 0,
        current: 1,
        pageSize: 8,
        totalPage: Math.ceil(searchDataSource.length / 8),
      });
    }
  }

  componentDidMount() {
    const {
      params: { getPopupContainer },
    } = this.props;
    if (typeof getPopupContainer === 'function') {
      getPopupContainer().appendChild(this._container);
    } else {
      document.body.appendChild(this._container);
    }
    window.addEventListener('keydown', this.listenKeydown);
  }

  componentWillUnmount() {
    const {
      params: { getPopupContainer },
    } = this.props;
    if (typeof getPopupContainer === 'function') {
      getPopupContainer().removeChild(this._container);
    } else {
      document.body.removeChild(this._container);
    }
    window.removeEventListener('keydown', this.listenKeydown);
  }

  /** 监听键盘上下方向键 */
  listenKeydown = (e) => {
    const { keyCode } = e;
    const { searchDataSource } = this.props;
    const { selectedIndex, current, totalPage, pageSize } = this.state;
    if (totalPage) {
      if (keyCode === 37) {
        // ←
        this.prevBtn();
      } else if (keyCode === 38) {
        // ↑
        let newSelectedIndex = selectedIndex - 1;
        let newCurrent = current;
        if (newSelectedIndex < 0) {
          if (current > 1) {
            newSelectedIndex = 7;
            newCurrent = newCurrent - 1;
            this.prevBtn();
          } else {
            newSelectedIndex = 0;
          }
        }
        this.setState({
          selectedIndex: newSelectedIndex,
          current: newCurrent,
        });
      } else if (keyCode === 39) {
        // →
        this.nextBtn();
      } else if (keyCode === 40) {
        // ↓
        let newSelectedIndex = selectedIndex + 1;
        let newCurrent = current;
        const max = searchDataSource.length % pageSize;
        if (newCurrent < totalPage) {
          if (newSelectedIndex > pageSize - 1) {
            newSelectedIndex = 0;
            newCurrent = newCurrent + 1;
            this.nextBtn;
          }
        } else if (max === 0) {
          if (newSelectedIndex > pageSize - 1) {
            newSelectedIndex = pageSize - 1;
          }
        } else if (newCurrent === totalPage) {
          if (newSelectedIndex >= max - 1) {
            newSelectedIndex = max - 1;
          }
        }
        this.setState({
          selectedIndex: newSelectedIndex,
          current: newCurrent,
        });
      } else if (keyCode === 13) {
        const node = document.querySelector(`.${this.list.classNameForSelected}`);
        node && (node as any).click();
      }
    }
  };

  highlightReplace(data: string, matchQ: string) {
    const newData = data.replace(matchQ, `*&*${matchQ}*&*`);
    return newData.split('*&*').map((value: any) => {
      if (value === matchQ) {
        return (
          <span className="xbzoom-selectcity-container--list--row--highlight" key={value}>
            {value}
          </span>
        );
      }
      return value;
    });
  }

  highlight = (data: searchResultArr) => {
    let { matchQ } = this.props;
    const { name, py, pinyin } = data;
    matchQ = matchQ.toLocaleLowerCase();
    if (name.indexOf(matchQ) >= 0) {
      return this.highlightReplace(name, matchQ);
    }

    if (pinyin.indexOf(matchQ) >= 0) {
      return (
        <span>
          {data.name}（{this.highlightReplace(pinyin, matchQ)}）
        </span>
      );
    }
    if (py.indexOf(matchQ) >= 0) {
      return (
        <span>
          {data.name}( {this.highlightReplace(py.toUpperCase(), matchQ.toUpperCase())} )
        </span>
      );
    }

    return data.name;
  };

  handClick(e: React.SyntheticEvent<HTMLDivElement>) {
    /* 阻止冒泡 */
    e.nativeEvent.stopImmediatePropagation();
  }

  /** prevBtn */
  prevBtn = () => {
    const { current } = this.state;
    if (current > 1) {
      this.setState({
        current: current - 1,
        selectedIndex: 0,
      });
    }
  };

  /** nextBtn */
  nextBtn = () => {
    const { current, totalPage } = this.state;
    if (current < totalPage) {
      this.setState({
        current: current + 1,
        selectedIndex: 0,
      });
    }
  };

  tabConProps = () => {
    const { index, selectVal, valIndex, params, addressMap, changeState } = this.props;
    return {
      index,
      selectVal,
      valIndex,
      params,
      addressMap,
      changeState,
      clearHotCityId: this.clearHotCityId,
    };
  };

  /** 点击热门城市 */
  clickHotCity = (provinceId: number, cityId: number) => {
    if (provinceId && cityId) {
      const { changeState } = this.props;
      const selectVal = [provinceId, cityId];
      changeState({
        index: selectVal.length,
        valIndex: selectVal.length - 1,
        selectVal,
        trigger: true,
      });
    }
    this.setState({
      selectedHotCityId: cityId || 0,
    });
  };

  /** 清空热门城市选中项 */
  clearHotCityId = () => {
    this.setState({
      selectedHotCityId: 0,
    });
  };

  render() {
    const className = 'xbzoom-selectcity-container';
    const {
      input,
      show,
      searching,
      params: { popupStyle },
      hotData,
      searchDataSource,
      setInputValue,
      notFoundContent,
    } = this.props;
    const { selectedHotCityId, selectedIndex, current, pageSize, totalPage } = this.state;
    const className2 = classnames({
      [`${className}--show`]: show,
      [className]: true,
    });
    /** 定位坐标 */
    const style = {
      left: input.left,
      top: input.top,
      width: input.width,
      ...popupStyle,
    };

    return ReactDOM.createPortal(
      <div className={className2} style={style} onClick={this.handClick}>
        {hotData.length > 0 && !searching && (
          <div className={`${className}--hotcity`}>
            <div className={`${className}--hotcity--title`}>热门城市：</div>
            <div className={`${className}--hotcity--body`}>
              {hotData.map((item) => (
                <span
                  key={item.cityId}
                  className={classnames({
                    [`${className}--hotcity--body--item`]: true,
                    [`${className}--hotcity--body--item--active`]: selectedHotCityId === item.cityId,
                  })}
                  onClick={() => this.clickHotCity(item.provinceId, item.cityId)}>
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {searching ? (
          <List
            ref={(node: List) => (this.list = node)}
            searchDataSource={searchDataSource}
            selectedIndex={selectedIndex}
            setInputValue={setInputValue}
            highlight={this.highlight}
            current={current}
            pageSize={pageSize}
            totalPage={totalPage}
            prevBtn={this.prevBtn}
            nextBtn={this.nextBtn}
            notFoundContent={notFoundContent}
          />
        ) : (
          <div>
            <Tab {...this.props} />
            <TabCon {...this.tabConProps()} />
          </div>
        )}
      </div>,
      this._container
    );
  }
}
