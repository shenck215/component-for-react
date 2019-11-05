import * as React from "react";
import classnames from "classnames";
import homeImg from "../assets/images/home.png";
import ayiImg from "../assets/images/ayi.jpg";

export interface PageProps {}

export interface PageStates {
  /** 是否显示大图 */
  visible: boolean;
  /** 是否显示原始大小 */
  original: boolean;
  /** 图片地址集合 */
  srcs: string[];
  /** 当前图片索引 */
  activeIndex: number;
}

export default class Zimage extends React.Component<PageProps, PageStates> {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      original: false,
      srcs: [homeImg, ayiImg],
      activeIndex: 0
    };
  }

  /** 放大图片 */
  zoomImg = (activeIndex: number) => {
    this.setState({
      visible: true,
      activeIndex
    });
  };

  /** 缩小图片 */
  shrink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { original } = this.state;
    if (original) {
      this.setState({
        original: false
      });
    } else {
      this.setState({
        visible: false
      });
    }
  };

  original = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const { original } = this.state;
    this.setState({
      original: !original
    });
  };

  render() {
    const className = "nextlc-zimage";
    const { visible, original, activeIndex, srcs } = this.state;
    return (
      <div className={className}>
        {srcs.map((src, index) => (
          <img
            key={index}
            className={classnames({
              [`${className}--img`]: true,
              [`${className}--img--last`]: index === srcs.length - 1,
            })}
            src={src}
            alt=""
            onClick={() => this.zoomImg(index)}
          />
        ))}
        {visible && (
          <>
            <div className={`${className}--mask`} />
            <div
              className={classnames({
                [`${className}--content`]: true,
                [`${className}--content--original`]: original
              })}
              onClick={this.shrink}
            >
              <img
                className={classnames({
                  [`${className}--content--img`]: true,
                  [`${className}--content--original--img`]: original
                })}
                src={srcs[activeIndex]}
                alt=""
                onClick={this.original}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}
