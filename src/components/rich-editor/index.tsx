import * as React from 'react';
import BraftEditor, { EditorState, BraftEditorProps } from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker';
// import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import Table from 'braft-extensions/dist/table';
import Markdown from 'braft-extensions/dist/markdown';
import MaxLength from 'braft-extensions/dist/max-length';
import HeaderId from 'braft-extensions/dist/header-id';

/** 加载高级颜色取色器扩展 */
BraftEditor.use(
  ColorPicker({
    includeEditors: ['xbzoom-rich-editor'],
  })
);

/** 加载代码高亮扩展 */
// BraftEditor.use(CodeHighlighter({
//   includeEditors: ['xbzoom-rich-editor'],
// }))

/** 加载表格扩展 */
BraftEditor.use(
  Table({
    defaultColumns: 4, // 默认列数
    defaultRows: 4, // 默认行数
    withDropdown: true, // 插入表格前是否弹出下拉菜单
    exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
    includeEditors: ['xbzoom-rich-editor'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  })
);

/** 加载markdown支持扩展 */
BraftEditor.use(
  Markdown({
    includeEditors: ['xbzoom-rich-editor'],
  })
);

/** 加载字数限制模块 */
BraftEditor.use(
  MaxLength({
    includeEditors: ['xbzoom-rich-editor'],
  })
);

/** 加载h1-h6锚点扩展 */
BraftEditor.use(
  HeaderId({
    includeEditors: ['xbzoom-rich-editor'],
  })
);

export interface PageProps extends BraftEditorProps {
  /** 初始内容 */
  defaultValue?: any;
  /** 最大文字长度 */
  maxLength?: number;
  /** 超出最大长度回调 */
  onReachMaxLength?: Function;
  /** 内容改变时回调 */
  onChange?: (editorState: any) => void;
  /** 保存时回调 ctrl+s */
  onSave?: Function;
}

export interface PageStates {
  editorState: EditorState;
}

// 编写扩展模块https://braft.margox.cn/demos/inline-style

export default class RichEditor extends React.Component<PageProps, PageStates> {
  constructor(props) {
    super(props);
    const { defaultValue } = props;
    this.state = {
      editorState: BraftEditor.createEditorState(defaultValue || ''),
    };
    // 获取媒体库实例
    // this.braftFinder = this.editor.getFinderInstance()
  }

  editor: BraftEditor | null;

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const { editorState } = this.state;
    const htmlContent = editorState.toHTML();
    const { onSave } = this.props;
    onSave && onSave(htmlContent);
  };

  handleEditorChange = (editorState: EditorState) => {
    this.setState({ editorState }, () => {
      const { onChange } = this.props;
      onChange && onChange(editorState);
    });
  };

  onReachMaxLength = () => {
    const { onReachMaxLength } = this.props;
    onReachMaxLength && onReachMaxLength();
  };

  render() {
    const className = 'xbzoom-rich-editor';
    const { editorState } = this.state;
    const { maxLength } = this.props;
    /** 额外添加的功能 */
    const extendControls = [];
    let braftEditorProps: any = {
      ...this.props,
      id: 'xbzoom-rich-editor',
      ref: (node) => (this.editor = node),
      value: editorState,
      extendControls,
      onChange: this.handleEditorChange,
      onSave: this.submitContent,
    };
    if (maxLength) {
      braftEditorProps = {
        ...braftEditorProps,
        maxLength,
        onReachMaxLength: this.onReachMaxLength,
      };
    }
    return (
      <div className={className}>
        <BraftEditor {...braftEditorProps} />
        {maxLength && (
          <div className={`${className}-count`}>
            {editorState.toText().length}/{maxLength}
          </div>
        )}
      </div>
    );
  }
}
