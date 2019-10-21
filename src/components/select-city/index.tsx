import * as React from "react";
import { Spin, Input, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import {
  parseAddress,
  parseAddressName,
  matchSearch
} from "../util/util";
import fetchFn from "../util/request";
import PostionContainer from "./postionContainer";

export interface ParamsProps {
  deepMap: Array<{ name: string; value?: number }>;
  // deepMap: [{name: '省'},{name: '市'},{name: '区'}],
  popupStyle?: {
    width: number;
    zIndex: number;
  } /* 弹窗样式 */;
  search?: boolean /* 搜索 */;
  level?: 1 | 2 | 3;/** 级别 1省 2省市 3省市区 */
  address?: any /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */;
  addressApi?: string /* fetch api方式城市基本数据 */;
  addressFetchData?: object /* fetch api方式城市请求参数 */;
  /* input 的样式 */
  style?: {
    width: number;
  };
  onChange?: (
    selectVal: number[],
    selectName: string[],
    code: any
  ) => void /* 选择到最后一层的回调 */;
  onSelect?: (
    selectVal: number[],
    selectName: string[],
    code: any
  ) => void /* 每层选择的回调，除了， 除了最后一层调用onChange */;
  placeholder?: string;
}

export interface SelectCityProps {
  code?: any;
  params: ParamsProps;
  onChange?: (value: any) => void;
}

export interface SelectCityState {
  show: boolean;
  input: {
    left: number;
    top: number;
    width: string | number;
  };
  index: number;
  valIndex: number;
  selectVal: number[];
  // selectName: l > 0 ? /* 根据默认值解析中文名称 */ parseAddressName(selectVal, this.addressMap) : [],
  selectName: string[];
  searching: boolean;
  searchName: string;
  searchDataSource: Object[];
  loading: boolean;
  addressMap: Map<any, any>[];
  addressMapSearch: any[];
  addressLoading: boolean;
  deepMap: Array<{ name: string; value?: number }>;
}

export default class SelectCity extends React.Component<
  SelectCityProps,
  SelectCityState
> {
  /** 用户选中的缓存便于还原 */
  _cache = {
    searchName: "",
    searchResult: {}
  };

  debounceTimer: any;

  constructor(props: SelectCityProps) {
    super(props);
    const {
      code,
      params: { deepMap, onChange, address, addressApi, level = 3 }
    } = this.props;
    let addressMap: Map<string, any>[] = [];
    let addressMapSearch: any[] = [];
    if (address) {
      const data = parseAddress(address, deepMap.length - 1);
      addressMap = data.addressMap;
      addressMapSearch = data.addressMapSearch;
    }
    const newDeepMap = this.kickWithLevel(deepMap, level)
    /* 构建默认数据的选中值 */
    let selectVal: Array<any> = [];

    newDeepMap.forEach((v, i) => {
      let value = v.value;
      if (value !== undefined) {
        selectVal.push(value);
      }
    });

    let selectValLength = selectVal.length;

    const state = {
      show: false,
      input: {
        left: -99999,
        top: -99999,
        width: "100%"
      },
      index: selectValLength > 0 ? selectValLength - 1 : 0,
      valIndex: selectValLength > 0 ? selectValLength - 2 : 0,
      selectVal: selectValLength > 0 ? /* selectVal默认值 */ selectVal : [],
      selectName:
        addressMap.length > 0 && selectValLength > 0
          ? parseAddressName(selectVal, addressMap)
          : [],
      searching: false,
      searchName: "",
      searchDataSource: [],
      loading: true,
      addressMap,
      addressMapSearch,
      addressLoading: !address || address.length <= 0,
      deepMap: newDeepMap,
    };
    this.state = state;

    if ((!address || address.length <= 0) && addressApi) {
      this.getAddress();
    } else {
      if (
        selectValLength === newDeepMap.length &&
        typeof onChange === "function"
      ) {
        onChange(selectVal, Array.from(new Set(state.selectName)), code);
      }
    }
  }

  debounce = (fn: any, delay: number) => {
    return () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        fn();
      }, delay);
    };
  };

  /** 根据级别剔除数据 */
  kickWithLevel = (deepMap: Array<{ name: string; value?: number }>, level: 1 | 2 | 3) => {
    if(level < 3){
      // 去掉区
      deepMap.pop()
    }
    if(level < 2){
      // 去掉市
      deepMap.pop()
    }
    return deepMap
  }

  getAddress = async () => {
    const {
      params: {
        addressApi,
        onChange,
        addressFetchData,
      },
      code
    } = this.props;
    const { deepMap } = this.state
    const { selectVal } = this.state;
    const data: any = await fetchFn(addressApi, addressFetchData || { type: 1 });
    if (data.status === 0) {
      const { addressMap, addressMapSearch } = parseAddress(
        data.data,
        deepMap.length - 1
      );
      const selectValLength = selectVal.length;
      let tempSelectName =
        selectValLength > 0
          ? /* 根据默认值解析中文名称 */ parseAddressName(selectVal, addressMap)
          : [];
      this.setState({
        addressLoading: false,
        addressMap,
        addressMapSearch,
        selectName: tempSelectName
      });
      if (
        selectValLength === deepMap.length &&
        typeof onChange === "function"
      ) {
        onChange(selectVal, Array.from(new Set(tempSelectName)), code);
      }
    }
  };

  fireEvent(element: any, event: any) {
    if ((document as any).createEventObject) {
      // IE浏览器支持fireEvent方法
      const evt = (document as any).createEventObject();
      return element.fireEvent("on" + event, evt);
    } else {
      // 其他标准浏览器使用dispatchEvent方法
      const evt = document.createEvent("HTMLEvents");
      // initEvent接受3个参数：
      // 事件类型，是否冒泡，是否阻止浏览器的默认行为
      evt.initEvent(event, true, true);
      element.dispatchEvent(evt);
    }
  }

  show(e: React.SyntheticEvent<any>) {
    const { selectVal } = this.state
    const selectValLength = selectVal.length
    /* 阻止冒泡 */
    e.nativeEvent.stopImmediatePropagation();
    this.fireEvent(document, "click");
    this.setState({
      show: true,
      input: this.input(),
      index: selectValLength > 0 ? selectValLength - 1 : 0,
      valIndex: selectValLength > 0 ? selectValLength - 2 : 0,
    });
  }

  hide = () => {
    this.setState({
      show: false
    });
  };

  getOffsetRect(node: HTMLInputElement) {
    const box = node.getBoundingClientRect();
    const body = document.body;
    const docElem = document.documentElement;

    /**
     * 获取页面的scrollTop,scrollLeft(兼容性写法)
     */
    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    const scrollLeft =
      window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    const clientTop = docElem.clientTop || body.clientTop;
    const clientLeft = docElem.clientLeft || body.clientLeft;
    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;
    return {
      //Math.round 兼容火狐浏览器bug
      top: Math.round(top),
      left: Math.round(left)
    };
  }

  inputCity: any;

  input = () => {
    const {
      params: {
        popupStyle = {
          width: 380
        }
      }
    } = this.props;
    const input = this.inputCity.input;
    const { left, top } = this.getOffsetRect(input);
    return {
      left,
      top: top + input.offsetHeight,
      width:
        popupStyle && popupStyle.width ? popupStyle.width : input.offsetWidth
    };
  };

  _container: HTMLElement;

  componentDidMount() {
    /* 挂载document的hide */
    document.addEventListener("click", this.hide);
  }

  /** 根据级别过滤城市数据 */
  filtrationWithLevel = (data, level: 1 | 2 | 3) => {
    const independent = Array.from(new Set(data.map(item => {
      return Array.prototype.slice.apply({
        ...item,
        length: level
      })
    }).map((item: any[]) => JSON.stringify(item)))).map((item: string) => JSON.parse(item))
    return independent.map(item => {
      const result = {}
      item.forEach((element, index) => {
        result[index] = element
      });
      return result
    })
  }

  postionContainerProps = () => {
    const {
      addressMap,
      input,
      show,
      searching,
      loading,
      searchDataSource,
      selectName,
      selectVal,
      index,
      valIndex,
      deepMap,
    } = this.state;
    const { params } = this.props;
    return {
      setInputValue: this.setInputValue,
      matchQ: this._cache.searchName,
      changeState: (params: any) => this.changeState(params),
      addressMap,
      params: {...params, deepMap},
      input,
      show,
      searching,
      searchDataSource: this.filtrationWithLevel(searchDataSource, params.level || 3),
      selectName,
      selectVal,
      index,
      valIndex,
      loading
    };
  };

  /**
   * 触发antd的form验证事件
   */
  triggerChange = (changedValue: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  autoSelect = (params: any) => {
    const { index, selectVal } = params;
    const data = this.state.addressMap[index].get(selectVal[index - 1]);
    let length = 0;
    let tempId;
    for (let area in data) {
      const tempData = data[area];
      for (let value in tempData) {
        if (tempData[value]) {
          length++;
          tempId = parseInt(value);
        }
      }
    }
    if (length === 1) {
      params.selectVal[index] = tempId;
      params.index++;
      params.valIndex++;
    }
  };

  changeState(params: any) {
    const props = this.props;
    const code = props.code;
    const { onChange, onSelect } = props.params;
    const { deepMap } = this.state

    /**
     * [max 最大联动的层级]
     */
    let max = deepMap.length;

    console.log(params)
    /* index不能大于max */
    if (params.index > max) {
      params.index = max - 1;
      params.valIndex = max - 2;
    }
    console.log(params)
    if (params.selectVal) {
      params.index < max && this.autoSelect(params);
      params.selectName = parseAddressName(
        params.selectVal,
        this.state.addressMap
      ).filter(item => item);
    }
    console.log(params)
    const trigger = params.trigger;
    delete params.trigger;

    /* 更新state */
    this.setState(params);
    /* onSelect */
    if (trigger && params.index !== max && typeof onSelect === "function") {
      onSelect(params.selectVal, params.selectName, code);
    }
    /* onChange */
    if (params.index === max && typeof onChange === "function") {
      params.searching = false
      this.hide();
      onChange(params.selectVal, Array.from(new Set(params.selectName)), code);
    }
    this.triggerChange({ selectVal: params.selectVal, selectName: Array.from(new Set(params.selectName)) });
  }

  clear = () => {
    const {
      code,
      params: { onChange }
    } = this.props;
    this.setState({
      searching: false,
      searchName: "",
      selectVal: [],
      selectName: [],
      index: 0,
      valIndex: 0
    });
    typeof onChange === "function" && onChange([], [], code);
    this.triggerChange({ selectVal: [], selectName: [] });
  };

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchName = e.target.value.trim();

    if (this.state.searchDataSource.length <= 0) {
      this._cache.searchName = searchName;
    }
    this.setState({
      searching: searchName !== "",
      searchName,
      selectVal: [],
      selectName: [],
      index: 0,
      valIndex: 0,
      show: true
    });

    /**
     * 防抖动
     */
    this.debounce(async () => {
      if (searchName === "") return;
      this.setState({
        loading: true
      });
      /**
       * 检索缓存
       */
      if (!Object.prototype.hasOwnProperty.call(this._cache, searchName)) {
        const searchResult = matchSearch(
          searchName,
          this.state.addressMapSearch,
          this.state.addressMap,
          this.state.deepMap
        );
        this._cache[searchName] = searchResult;
      }
      this._cache.searchName = searchName;
      this.setState({
        searchDataSource: this._cache[searchName],
        loading: false
      });
    }, 300)();
  }

  setInputValue = (selectVal: number[], selectName: string[]) => {
    const {
      code,
      params: { onChange }
    } = this.props;
    this.setState({
      selectVal,
      selectName,
      searchName: Array.from(new Set(selectName)).join("-"),
      show: false,
      searching: false,
    });
    typeof onChange === "function" && onChange(selectVal, Array.from(new Set(selectName)), code);
  };

  getData() {
    const { selectVal, selectName } = this.state;
    return {
      ids: selectVal,
      names: selectName
    };
  }

  inputCityProps = () => {
    const { searching, searchName, selectName } = this.state;
    const {
      params: { style, placeholder, search }
    } = this.props;
    const props: any = {
      ref: node => (this.inputCity = node),
      onClick: (e: React.SyntheticEvent<any>) => this.show(e),
      placeholder: placeholder || "支持中文/拼音/简拼",
      style: style
    };

    /**
     * 是否开启模糊搜索
     */
    search === true
      ? (props.onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
          this.onChange(e))
      : (props.readOnly = true);

    searching
      ? (props.value = searchName)
      : (props.value = Array.from(new Set(selectName)).join("-"));

    return props;
  };

  render() {
    const {
      params: { style = { width: "100%" } }
    } = this.props;
    const { addressLoading, show } = this.state;
    const className = 'nextlc-selectcity'
    return (
      <ConfigProvider locale={zhCN}>
        <div
          className={className}
          style={{ width: style.width, zIndex: 999, ...style }}
        >
          {addressLoading ? (
            <div style={{ width: style.width, display: "inline-block" }}>
              <Spin spinning={addressLoading}>
                <div className={`${className}--input`} style={{ width: style.width }}>
                  <Input {...this.inputCityProps()} />
                </div>
              </Spin>
            </div>
          ) : (
            <>
              <div className={`${className}--input`} style={{ width: style.width }}>
                <Input {...this.inputCityProps()} />
                <span className={`${className}--input--clear`} onClick={() => this.clear()}>
                  x
                </span>
              </div>
              {!addressLoading && show && (
                <PostionContainer {...this.postionContainerProps()} />
              )}
            </>
          )}
        </div>
      </ConfigProvider>
    );
  }
}
