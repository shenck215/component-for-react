import React from 'react';

interface PageProps {
/** 标题 */
title: string | number | JSX.Element;
/** 按钮组 */
btnDom?: JSX.Element;
/**标题右额外组 */
extraLeftDom?: JSX.Element;
}

interface PageStates {

}

/** 标题块 */
class Head extends React.Component<PageProps, PageStates> {

  render() {
    const { title, btnDom, extraLeftDom } = this.props;
    return (
      <div className="nextlc-head">
        <span className="nextlc-head_title">{title}</span>
        <div className="nextlc-head_content_left">{extraLeftDom}</div>
        <div
          className="nextlc-head_content_right"
          style={extraLeftDom ? { position: 'relative', top: -1 } : {}}
        >
          {btnDom}
        </div>
      </div>
    );
  }
}

export default Head;
