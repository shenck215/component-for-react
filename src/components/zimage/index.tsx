import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classnames from 'classnames';

export interface PageProps {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
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
  visibleImg: boolean;
  /** 是否显示遮罩 */
  visibleMask: boolean;
  /** 是否显示原始大小 */
  original: boolean;
  /** 图片地址集合 */
  srcs: string[];
  /** 当前图片索引 */
  activeIndex: number;
  /** 展示图的样式 */
  CSSProperties: React.CSSProperties;
  CSSPropertiesSave: React.CSSProperties;
}

export default class Zimage extends React.Component<PageProps, PageStates> {
  static defaultProps = {
    wrapperClassName: '',
    wrapperStyle: {},
  };

  private _container: HTMLElement;

  constructor(props) {
    super(props);
    const { srcs } = props;
    const CSSProperties = {
      left: 0,
      right: 0,
      transform: 'translate(-50%, -50%) scale(0)',
      filter: 'alpha(opacity=0)',
      opacity: 0,
    };
    this.state = {
      visibleMask: false,
      visibleImg: false,
      original: false,
      srcs,
      activeIndex: 0,
      CSSProperties,
      CSSPropertiesSave: CSSProperties,
    };
    this._container = document.body;
  }

  UNSAFE_componentWillReceiveProps(nextProps: PageProps) {
    if (this.props.srcs !== nextProps.srcs) {
      this.setState({
        srcs: nextProps.srcs,
      });
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.switchoverPicture);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.switchoverPicture);
  }

  /** 切换图片 */
  switchoverPicture = (e: KeyboardEvent, activeIndex?: number) => {
    e.stopPropagation();
    if (typeof activeIndex === 'number') {
      this.setState({
        activeIndex,
      });
    } else {
      const { keyCode } = e;
      if (keyCode === 37) {
        // ←
        this.prevBtn(e);
      } else if (keyCode === 39) {
        // →
        this.nextBtn(e);
      } else if (keyCode === 32) {
        // 空格
        this.original(e);
      } else if (keyCode === 27) {
        e.preventDefault();
        // 空格
        this.shrink();
      }
    }
  };

  /** 前一张 */
  prevBtn = (e: React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) => {
    e.stopPropagation();
    const { activeIndex } = this.state;
    const newActiveIndex = activeIndex - 1;
    this.setState(
      {
        activeIndex: newActiveIndex >= 0 ? newActiveIndex : 0,
      },
      () => {
        const { activeIndex, visibleImg, visibleMask, original } = this.state;
        const { onPrev, onChange } = this.props;
        onPrev && onPrev(activeIndex);
        onChange && onChange(activeIndex, visibleImg && visibleMask, original);
      }
    );
  };

  /** 后一张 */
  nextBtn = (e: React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) => {
    e.stopPropagation();
    const { activeIndex, srcs } = this.state;
    const newActiveIndex = activeIndex + 1;
    const max = srcs.length - 1;
    this.setState(
      {
        activeIndex: newActiveIndex <= max ? newActiveIndex : max,
      },
      () => {
        const { activeIndex, visibleMask, visibleImg, original } = this.state;
        const { onNext, onChange } = this.props;
        onNext && onNext(activeIndex);
        onChange && onChange(activeIndex, visibleMask && visibleImg, original);
      }
    );
  };

  /** 放大图片 */
  zoomImg = (e?: React.MouseEvent<HTMLImageElement, MouseEvent>, activeIndex?: number) => {
    e && e.stopPropagation();
    const CSSProperties = {
      left: e && e.pageX ? e.pageX : 0,
      top: e && e.pageY ? e.pageY : 0,
      transform: 'translate(-50%, -50%) scale(0)',
      filter: 'alpha(opacity=0)',
      opacity: 0,
    };
    this.setState({
      visibleImg: true,
      activeIndex: activeIndex || 0,
      CSSProperties,
      CSSPropertiesSave: CSSProperties,
    });
    setTimeout(() => {
      this.setState(
        {
          visibleMask: true,
          CSSProperties: {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(1)',
            filter: 'alpha(opacity=100)',
            opacity: 1,
          },
        },
        () => {
          document.body.style.overflow = 'hidden';
          const { activeIndex, visibleImg, visibleMask, original } = this.state;
          const { onChange } = this.props;
          onChange && onChange(activeIndex, visibleImg && visibleMask, original);
        }
      );
    }, 0);
  };

  /** 缩小图层 */
  downsize = () => {
    const { original } = this.state;
    if (original) {
      this.setState(
        {
          original: false,
        },
        () => {
          const { activeIndex, visibleMask, visibleImg, original } = this.state;
          const { onChange } = this.props;
          onChange && onChange(activeIndex, visibleMask && visibleImg, original);
        }
      );
    } else {
      this.shrink();
    }
  };

  /** 缩小图片 */
  shrink = () => {
    const { CSSPropertiesSave } = this.state;
    this.setState({
      original: false,
      visibleMask: false,
      CSSProperties: CSSPropertiesSave,
    });
    setTimeout(() => {
      this.setState(
        {
          visibleImg: false,
        },
        () => {
          document.body.style.overflow = '';
          const { activeIndex, visibleImg, visibleMask, original } = this.state;
          const { onChange } = this.props;
          onChange && onChange(activeIndex, visibleImg && visibleMask, original);
        }
      );
    }, 100);
  };

  /** 原始尺寸切换 */
  original = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent) => {
    e.stopPropagation();
    const { original } = this.state;
    this.setState(
      {
        original: !original,
      },
      () => {
        const { activeIndex, visibleImg, visibleMask, original } = this.state;
        const { onChange } = this.props;
        onChange && onChange(activeIndex, visibleImg && visibleMask, original);
      }
    );
  };

  render() {
    const className = 'xbzoom-zimage';
    const { visibleMask, visibleImg, original, activeIndex, srcs, CSSProperties } = this.state;
    const { wrapperClassName, wrapperStyle } = this.props;
    const showOperation = !original && srcs && srcs.length > 1;
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
            style={wrapperStyle}
            src={src}
            alt=""
            onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => this.zoomImg(e, index)}
          />
        ))}
        {(visibleImg || visibleMask) &&
          ReactDOM.createPortal(
            <div>
              {visibleMask && <div className={`${className}--mask`} />}
              <div
                className={classnames({
                  [`${className}--content`]: true,
                  [`${className}--content--original`]: original,
                })}
                onClick={this.downsize}>
                <div className={`${className}--content--body`} style={CSSProperties} onClick={this.original}>
                  <img
                    className={classnames({
                      [`${className}--content--body--img`]: true,
                      [`${className}--content--body--original--img`]: original,
                    })}
                    src={srcs[activeIndex]}
                    alt=""
                  />
                  {showOperation && (
                    <div className={`${className}--content--body--progress`}>
                      {srcs.map((item, index) => (
                        <i
                          key={index}
                          className={`xbzoom xbzoom-yuanxing ${className}--content--body--progress--yuanxing ${
                            activeIndex === index ? `${className}--content--body--progress--yuanxing--active` : ``
                          }`}
                          onClick={(e: any) => this.switchoverPicture(e, index)}
                        />
                      ))}
                    </div>
                  )}
                  {showOperation && (
                    <i
                      title="前一张"
                      className={`xbzoom xbzoom-left ${className}--content--body--prevBtn`}
                      onClick={this.prevBtn}
                    />
                  )}
                  {showOperation && (
                    <i
                      title="后一张"
                      className={`xbzoom xbzoom-right ${className}--content--body--nextBtn`}
                      onClick={this.nextBtn}
                    />
                  )}
                </div>
              </div>
            </div>,
            this._container
          )}
      </div>
    );
  }
}
