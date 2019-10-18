import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classnames from "classnames";
import { Table } from "antd";
import { searchResultArr } from "../util/baseType";
import { ParamsProps } from "./index";
import Tab from "./tab";
import TabCon from "./tabCon";

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
}

export interface PostionContainerStates {
  selectedIndex: number;
  current: number;
  pageSize: number;
  totalPage: number;
}

export default class PostionContainer extends React.Component<
  PostionContainerProps,
  PostionContainerStates
> {
  private _container: HTMLDivElement;
  private prevBtn: HTMLDivElement;
  private nextBtn: HTMLDivElement;
  constructor(props: PostionContainerProps) {
    super(props);
    const { searchDataSource } = props
    this.state = {
      selectedIndex: 0,
      current: 1,
      pageSize: 8,
      totalPage: Math.ceil(searchDataSource.length / 8),
    }
    this._container = document.createElement("div");
  }

  UNSAFE_componentWillReceiveProps(nextProps: PostionContainerProps){
    const { searchDataSource } = nextProps
    if(JSON.stringify(searchDataSource) !== JSON.stringify(this.props.searchDataSource)){
      this.setState({
        selectedIndex: 0,
        current: 1,
        pageSize: 8,
        totalPage: Math.ceil(searchDataSource.length / 8),
      })
    }
  }

  componentDidMount() {
    document.body.appendChild(this._container);
    window.addEventListener('keydown', this.listenKeydown)
  }

  componentWillUnmount() {
    document.body.removeChild(this._container);
    window.removeEventListener('keydown', this.listenKeydown)
  }

  /** 监听键盘上下方向键 */
  listenKeydown = e => {
    const { keyCode } = e
    const { searchDataSource } = this.props
    const { selectedIndex, current, totalPage, pageSize } = this.state
    if(totalPage){
      if(keyCode === 37){// ←
        if(current > 1){
          this.prevBtn.click()
          this.setState({
            current: current - 1,
            selectedIndex: 0
          })
        }
      }else if(keyCode === 38){// ↑
        let newSelectedIndex = selectedIndex - 1
        let newCurrent = current
        if(newSelectedIndex < 0){
          if(current > 1){
            newSelectedIndex = 7
            newCurrent = newCurrent - 1
            this.prevBtn.click()
          }else{
            newSelectedIndex = 0
          }
        }
        this.setState({
          selectedIndex: newSelectedIndex,
          current: newCurrent,
        })
      }else if(keyCode === 39){// →
        if(current < totalPage){
          this.nextBtn.click()
          this.setState({
            current: current + 1,
            selectedIndex: 0
          })
        }
      }else if(keyCode === 40){// ↓
        let newSelectedIndex = selectedIndex + 1
        let newCurrent = current
        if(newCurrent < totalPage){
          if(newSelectedIndex > pageSize - 1){
            newSelectedIndex = 0
            newCurrent = newCurrent + 1
            this.nextBtn.click()
          }
        }else if(newCurrent === totalPage){
          const max = searchDataSource.length % pageSize
          if(newSelectedIndex > max - 1){
            newSelectedIndex = max - 1
          }
        }
        this.setState({
          selectedIndex: newSelectedIndex,
          current: newCurrent,
        })
      }else if(keyCode === 13){
        const node = document.querySelector('.nextlc-selectcity-container--active')
        node && (node as any).click()
      }
    }
  }

  highlightReplace(data: string, matchQ: string) {
    const newData = data.replace(matchQ, `*&*${matchQ}*&*`);
    return newData.split("*&*").map((value: any) => {
      if (value === matchQ) {
        return (
          <span style={{ color: "#ff6600" }} key={value}>
            {value}
          </span>
        );
      }
      return value;
    });
  }

  highlight = (data: searchResultArr) => {
    let { matchQ } = this.props;
    const { name, firstOfAll, totalPY } = data;
    matchQ = matchQ.toLocaleLowerCase();
    if (name.indexOf(matchQ) >= 0) {
      return this.highlightReplace(name, matchQ);
    }

    if (totalPY.indexOf(matchQ) >= 0) {
      return (
        <span>
          {data.name}（{this.highlightReplace(totalPY, matchQ)}）
        </span>
      );
    }
    if (firstOfAll.indexOf(matchQ) >= 0) {
      return (
        <span>
          {data.name}({" "}
          {this.highlightReplace(
            firstOfAll.toUpperCase(),
            matchQ.toUpperCase()
          )}{" "}
          )
        </span>
      );
    }

    return data.name;
  };

  columns = () => {
    return [
      {
        key: "city",
        render: (text: {}, record: {}) => {
          const hasName: string[] = []
          const arr: React.ReactElement<HTMLSpanElement>[] = [];
          for (let key in record) {
            const data = record[key];
            if(!hasName.includes(data.name)){
              hasName.push(data.name)
              arr.push(<span key={data.value}>{this.highlight(data)} </span>);
            }
          }
          return (
            <div>
              {Array.from(new Set(arr)).map((value, index) => {
                return (
                  <span key={index}>
                    {value}
                    {index < arr.length - 1 ? "，" : ""}
                  </span>
                );
              })}
            </div>
          );
        }
      }
    ];
  };

  handClick(e: React.SyntheticEvent<HTMLDivElement>) {
    /* 阻止冒泡 */
    e.nativeEvent.stopImmediatePropagation();
  }

  tableProps = () => {
    const { 
      loading, 
      searchDataSource, 
      setInputValue, 
      // selectVal
    } = this.props;
    const { pageSize, totalPage } = this.state
    let props = {
      size: "small",
      rowKey: (record: {}) => {
        let key = "";
        for (let i in record) {
          key += record[i].value;
        }
        return key;
      },
      columns: this.columns(),
      showHeader: false,
      locale: {
        emptyText: "找不到你要的结果，换个试试"
      },
      pagination:
      totalPage > 1
          ? {
              pageSize,
              simple: true,
              itemRender: (page, type: 'page' | 'prev' | 'next', originalElement) => {
                return <div ref={node => this[`${type === 'prev' ? 'prevBtn' : type === 'next' ? 'nextBtn' : ''}`] = node}>{originalElement}</div>
              }
            }
          : false,
      loading,
      dataSource: searchDataSource,
      onRow: (record: {}) => {
        return {
          onClick: () => {
            let selectVal: number[] = [];
            let selectName: string[] = [];
            for (let key in record) {
              const data = record[key];
              selectVal.push(data.value);
              selectName.push(data.name);
            }
            setInputValue(selectVal, selectName);
          }
        };
      },
      rowClassName: (record: {}, index) => {
        const className = 'nextlc-selectcity-container'
        // if (selectVal.length <= 0) {
        //   return "";
        // }
        // let rowId: any[] = [];
        // for (let key in record) {
        //   const data: any = record[key];
        //   rowId.push(data.value);
        // }
        // let className2 = `${className}--active`;
        // for (let i = 0, l = selectVal.length; i < l; i++) {
        //   if (selectVal[i] !== rowId[i]) {
        //     className2 = "";
        //     break;
        //   }
        // }
        const { selectedIndex } = this.state
        let className2 = selectedIndex === index ? `${className}--active` : ''
        return className2;
      }
    } as any;
    return props;
  };

  tabConProps = () => {
    const {
      index,
      selectVal,
      valIndex,
      params,
      addressMap,
      changeState
    } = this.props;
    return {
      index,
      selectVal,
      valIndex,
      params,
      addressMap,
      changeState
    };
  };

  render() {
    const className = 'nextlc-selectcity-container'
    const {
      input,
      show,
      searching,
      params: { popupStyle }
    } = this.props;
    const className2 = classnames({
      [`${className}--show`]: show,
      [className]: true
    });
    /** 定位坐标 */
    const style = {
      left: input.left,
      top: input.top,
      width: input.width,
      ...popupStyle
    };

    return ReactDOM.createPortal(
      <div className={className2} style={style} onClick={this.handClick}>
        {searching ? (
          <Table {...this.tableProps()} />
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
