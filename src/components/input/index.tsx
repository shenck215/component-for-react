import * as React from 'react';
import * as classnames from 'classnames';
import { MouseEventHandler } from '../util/baseType';

export interface PageProps {
  ref?: (node: HTMLInputElement) => void;
  /** 提示文案 */
  placeholder?: string;
  /** 只读 */
  readOnly?: boolean;
  /** 类名 */
  className?: string;
  /** 样式 */
  style?: React.CSSProperties;
  /** 禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onClick?: MouseEventHandler<Element>;
  defaultValue?: any;
  value?: any;
  /** onchange */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default class Input extends React.Component<PageProps, {}> {
  static defaultProps = {
    overlayClassName: '',
    placeholder: '',
  };

  input: HTMLElement;

  saveInput = (node: HTMLInputElement) => {
    this.input = node;
  };

  render() {
    const {
      className: overlayClassName = '',
      style,
      disabled,
      placeholder,
      defaultValue,
      value,
      readOnly,
      onClick,
      onChange,
    } = this.props;
    const className = 'xbzoom-input';
    return (
      <input
        className={classnames({
          [className]: true,
          [overlayClassName]: !!overlayClassName,
        })}
        ref={this.saveInput}
        readOnly={readOnly}
        defaultValue={defaultValue}
        value={value}
        style={style}
        disabled={disabled}
        placeholder={placeholder}
        onClick={onClick}
        onChange={onChange}
      />
    );
  }
}
