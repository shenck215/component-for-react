import React from "react"

interface PageProps {
  /** 文字 */
  text?: string;
}

interface PageState {
  /** 提示 */
  tip: string;
}

export default class HelloWorld extends React.Component<PageProps, PageState> {

  constructor(props:any){
    super(props)
    this.state = {
      tip: '嘿嘿！'
    }
  }

  static defaultProps  = {
    text: 'Hello World'
  }

  render(){
    const { text } = this.props
    const { tip } = this.state
    const prefixCls = 'nextlc-HelloWorld'
    return [
      <div key='1' className={prefixCls}>{text}</div>,
      <div key='2'>{tip}</div>
    ]
  }
}