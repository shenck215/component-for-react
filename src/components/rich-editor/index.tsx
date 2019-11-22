import * as React from "react";
import * as classnames from 'classnames'
import { Editor, EditorState } from 'draft-js'

export interface PageProps {
  wrapprClassName?: string;
}

export interface PageStates {
  editorState: EditorState;
}

export default class RickEditor extends React.Component<PageProps, PageStates> {
  
  static defaultProps = {
    wrapprClassName: ''
  }

  constructor(props){
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  onChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { wrapprClassName } = this.props
    const { editorState } = this.state
    const className = `nextlc-rich-editor`
    return (
      <div className={classnames({
        [className]: true,
        [wrapprClassName || '']: wrapprClassName,
      })}>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
