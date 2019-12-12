import React from 'react';

export interface PageProps {
  loading?: boolean;
}

export default class Spin extends React.Component<PageProps, {}> {
  static defaultProps = {
    loading: true,
  };

  render() {
    const { loading } = this.props;
    const className = 'xbzoom-spin';
    return (
      <div className={className}>
        {loading && (
          <div className={`${className}--mask`}>
            <i className={`xbzoom xbzoom-loading ${className}--mask--loading`} />
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}
