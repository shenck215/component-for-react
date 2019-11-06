import * as React from "react";
import * as ReactDOM from 'react-dom'
import classnames from "classnames";

export interface PageProps {
  wrapperClassName?: string;
  /** 图片地址集合 */
  srcs: string[];
  /** 前一张图片, 返回当前索引 */
  onPrev?: (currentIndex: number) => void;
  /** 后一张图片, 返回当前索引 */
  onNext?: (currentIndex: number) => void;
  /** currentIndex 当前索引 visible 是否放大 original 是否原始尺寸 */
  onChange?: (currentIndex: number, visible: boolean, original: boolean) => void;
}

export interface PageStates {
  /** 是否显示大图 */
  visible: boolean;
  /** 是否显示原始大小 */
  original: boolean;
  /** 图片地址集合 */
  srcs: string[];
  /** 当前图片索引 */
  activeIndex: number;
  key: number;
}

export default class Zimage extends React.Component<PageProps, PageStates> {
  static defaultProps = {
    wrapperClassName: ''
  };

  private _container: HTMLDivElement;

  constructor(props) {
    super(props);
    const { srcs } = props
    this.state = {
      visible: false,
      original: false,
      srcs,
      activeIndex: 0,
      key: 1,
    };
    this._container = document.createElement("div");
  }

  componentDidMount() {
    window.addEventListener("keydown", this.switchoverPicture);
    window.addEventListener("resize", this.resize);
    document.body.appendChild(this._container);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.switchoverPicture);
    window.removeEventListener("resize", this.resize);
    document.body.removeChild(this._container);
  }

  /** 自适应 */
  resize = () => {
    const { key } = this.state
    this.setState({
      key: key + 1
    })
  }

  /** 切换图片 */
  switchoverPicture = (e: KeyboardEvent, activeIndex?: number) => {
    if (typeof activeIndex === "number") {
      e.stopPropagation();
      this.setState({
        activeIndex
      });
    } else {
      const { keyCode } = e;
      if (keyCode === 37) {
        // ←
        this.prevBtn(e)
      } else if (keyCode === 39) {
        // →
        this.nextBtn(e)
      }
    }
  };

  /** 前一张 */
  prevBtn = (e:React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) => {
    e.stopPropagation()
    const { activeIndex } = this.state;
    const newActiveIndex = activeIndex - 1;
    this.setState({
      activeIndex: newActiveIndex >= 0 ? newActiveIndex : 0
    }, () => {
      const { activeIndex, visible, original } = this.state
      const { onPrev, onChange } = this.props
      onPrev && onPrev(activeIndex)
      onChange && onChange(activeIndex, visible, original)
    });
  }

  /** 后一张 */
  nextBtn = (e:React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) => {
    e.stopPropagation()
    const { activeIndex, srcs } = this.state;
    const newActiveIndex = activeIndex + 1;
    const max = srcs.length - 1;
    this.setState({
      activeIndex: newActiveIndex <= max ? newActiveIndex : max
    }, () => {
      const { activeIndex, visible, original } = this.state
      const { onNext, onChange } = this.props
      onNext && onNext(activeIndex)
      onChange && onChange(activeIndex, visible, original)
    });
  }

  /** 放大图片 */
  zoomImg = (activeIndex: number) => {
    this.setState({
      visible: true,
      activeIndex
    }, () => {
      const { activeIndex, visible, original } = this.state
      const { onChange } = this.props
      onChange && onChange(activeIndex, visible, original)
    });
  };

  /** 缩小图片 */
  shrink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { original } = this.state;
    if (original) {
      this.setState({
        original: false
      }, () => {
        const { activeIndex, visible, original } = this.state
        const { onChange } = this.props
        onChange && onChange(activeIndex, visible, original)
      });
    } else {
      this.setState({
        visible: false
      }, () => {
        const { activeIndex, visible, original } = this.state
        const { onChange } = this.props
        onChange && onChange(activeIndex, visible, original)
      });
    }
  };

  /** 原始尺寸切换 */
  original = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const { original } = this.state;
    this.setState({
      original: !original
    }, () => {
      const { activeIndex, visible, original } = this.state
      const { onChange } = this.props
      onChange && onChange(activeIndex, visible, original)
    });
  };

  render() {
    const className = "nextlc-zimage";
    const { visible, original, activeIndex, srcs, key } = this.state;
    const { wrapperClassName } = this.props
    return (
      <div className={className}>
        {srcs.map((src, index) => (
          <img
            key={index}
            className={classnames({
              [`${className}--img`]: true,
              [`${className}--img--last`]: index === srcs.length - 1,
              [wrapperClassName || '']: !!wrapperClassName,
            })}
            src={src}
            alt=""
            onClick={() => this.zoomImg(index)}
          />
        ))}
        {
          visible && ReactDOM.createPortal(<div key={key}>
            <div className={`${className}--mask`} />
            <div
              className={classnames({
                [`${className}--content`]: true,
                [`${className}--content--original`]: original
              })}
              onClick={this.shrink}
            >
              <div
                className={`${className}--content--body`}
                onClick={this.original}
              >
                <img
                  className={classnames({
                    [`${className}--content--body--img`]: true,
                    [`${className}--content--body--original--img`]: original,
                  })}
                  src={srcs[activeIndex]}
                  alt=""
                />
                {!original && (
                  <div className={`${className}--content--body--progress`}>
                    {srcs.map((item, index) => (
                      <i
                        key={index}
                        className={`nextlc nextlc-yuanxing ${className}--content--body--progress--yuanxing ${
                          activeIndex === index
                            ? `${className}--content--body--progress--yuanxing--active`
                            : ``
                        }`}
                        onClick={(e: any) => this.switchoverPicture(e, index)}
                      />
                    ))}
                  </div>
                )}
                {
                  !original && (
                    <i
                      title='前一张'
                      className={`nextlc nextlc-left ${className}--content--body--prevBtn`}
                      onClick={this.prevBtn}
                    />
                  )
                }
                {
                  !original && (
                    <i
                      title='后一张'
                      className={`nextlc nextlc-right ${className}--content--body--nextBtn`}
                      onClick={this.nextBtn}
                    />
                  )
                }
              </div>
            </div>
          </div>, this._container)
        }
      </div>
    );
  }
}
