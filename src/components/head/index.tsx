import * as React from 'react';
import classnames from 'classnames';

export interface PageProps {
  wrapperClassName?: string;
  /** 标题 */
  title: string | number | JSX.Element;
  /** 按钮组 */
  btnDom?: JSX.Element;
  /**标题右额外组 */
  extraDom?: JSX.Element;
}

export default class Head extends React.Component<PageProps, {}> {
  static defaultProps = {
    wrapperClassName: '',
  };

  render() {
    const { wrapperClassName, title, btnDom, extraDom } = this.props;
    const className = 'xbzoom-head';
    return (
      <div
        className={classnames({
          [className]: true,
          [wrapperClassName || '']: wrapperClassName,
        })}>
        <span className={`${className}--title`}>{title}</span>
        <div className={`${className}--extraDom`}>{extraDom}</div>
        <div className={`${className}--btnDom`}>{btnDom}</div>
      </div>
    );
  }
}
