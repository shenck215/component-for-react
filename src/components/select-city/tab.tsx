import * as React from "react";
import * as classnames from "classnames";
import { PostionContainerProps } from "./postionContainer";

class Tab extends React.Component<PostionContainerProps, {}> {
  constructor(props: PostionContainerProps) {
    super(props);
  }
  render() {
    const className = "nextlc-selectcity-container--tab";
    return (
      <div className={className}>
        <TabBtns {...this.props} parentClassName={className} />
      </div>
    );
  }
}

export interface TabBtnsProps extends PostionContainerProps {
  parentClassName: string;
}

class TabBtns extends React.Component<TabBtnsProps, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    let { params, index, parentClassName } = this.props;

    /**
     * [max 最大联动的层级]
     */
    let deepMap = params.deepMap;
    let max = deepMap.length;

    /* index不能大于max */
    if (index >= max) {
      index--;
    }

    let btnList: React.ReactNode[] = [];
    deepMap.forEach((v: any, i: number) => {
      let active = i === index ? true : false;
      btnList.push(
        <OneTabBtn
          active={active}
          dataKey={i}
          key={i}
          name={v.name}
          {...this.props}
          parentClassName={`${parentClassName}--btns`}
        />
      );
    });

    return <ul className={`${parentClassName}--btns`}>{btnList}</ul>;
  }
}

class OneTabBtn extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  handleClick(e: React.SyntheticEvent<HTMLLIElement>) {
    /* 阻止冒泡 */
    e.nativeEvent.stopImmediatePropagation();
    let { dataKey, changeState } = this.props;
    changeState({
      index: dataKey,
      valIndex: --dataKey
    });
  }
  render() {
    let { name, active, selectName, dataKey, parentClassName } = this.props;
    if (selectName[dataKey]) {
      // if(dataKey === 2) {
      //     name = `${selectName[dataKey]}`;
      // }
      // else {
      //     name = `${selectName[dataKey]}${name}`;
      // }
      name = `${selectName[dataKey]}`;
    }
    let className = classnames({
      [`${parentClassName}--btn`]: true,
      [`${parentClassName}--btn--active`]: active
    });
    return (
      <li onClick={e => this.handleClick(e)} className={className}>
        {name}
      </li>
    );
  }
}

export default Tab;
