import React from 'react'

export interface PageProps {
  loading?: boolean;
}

export interface PageStates {
  
}

export default class Spin extends React.Component<PageProps, PageStates>{

  static defaultProps = {
    loading: true,
  }

  render(){
    const { loading } = this.props
    const className = 'nextlc-spin'
    return (
      <div className={className}>
        {
          loading &&
          <div className={`${className}--mask`}>
            <i className={`nextlc nextlc-loading ${className}--mask--loading`} />
          </div>
        }
        {this.props.children}
      </div>
    )
  }
}