import React from "react";
import { connect } from "dva";
import { Modal, Form, Input, Select, Switch, Upload, Button, Icon } from "antd";

const { Option } = Select;
const categories = [
  { id: "1", name: "Web" },
  { id: "2", name: "iOS" },
  { id: "3", name: "Java" }
];

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
};

const ArticleDialog = Form.create()(
  class ArticleDialog extends React.Component {
    constructor(props) {
      super(props);

      this.handleOk = this.handleOk.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handlePathChange = this.handlePathChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.article) {
        return { path: nextProps.article.path };
      } else {
        return prevState;
      }
    }

    state = {
      path: ""
    };

    render() {
      const { visble, title, article } = this.props;
      const { getFieldDecorator } = this.props.form;

      return (
        <Modal
          title={title}
          visible={visble}
          okText="Save"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <Form layout="horizontal">
            <Form.Item label="类型" {...formItemLayout}>
              {getFieldDecorator("category", {
                initialValue: article ? article.category : 1,
                rules: [{ required: true, message: "请选择分类" }]
              })(
                <Select style={{ width: 120 }}>
                  {categories.map(({ id, name }) => (
                    <Option key={id} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="标题" {...formItemLayout}>
              {getFieldDecorator("title", {
                initialValue: article ? article.title : "",
                rules: [{ required: true, message: "标题不能为空" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="tags" {...formItemLayout}>
              {getFieldDecorator("tags", {
                initialValue: article ? article.tags : ""
              })(<Input />)}
            </Form.Item>
            <Form.Item label="是否可见" {...formItemLayout}>
              {getFieldDecorator("hidden", {
                initialValue: article ? article.hidden : true
              })(<Switch defaultChecked={true} />)}
            </Form.Item>
            <Form.Item label="文件路径" {...formItemLayout}>
              {getFieldDecorator("path", {
                rules: [
                  {
                    initialValue: this.props.article
                      ? this.props.article.path
                      : "",
                    required: true,
                    message: "请上传文件"
                  }
                ]
              })(<Input readOnly />)}
            </Form.Item>
            <Form.Item label="上传文件" {...formItemLayout}>
              {getFieldDecorator("file", {})(
                <Upload
                  accept="text/markdown"
                  action="http://localhost:3000/api/article/file"
                  onChange={({ file: info }) => {
                    if (info.status === "done") {
                      let head = info.response && info.response.head;
                      let errcode = head && head.errcode;

                      if (errcode === 0) {
                        this.props.form.setFieldsValue({
                          path: info.response.data.filename
                        });
                      }
                    }
                  }}
                >
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }

    // handleCategoryChange() {}

    // handleTitleChange() {}

    // handleTagsChange() {}

    // handleHiddenChange() {}

    handlePathChange() {}

    handleOk = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let article = this.props.article || {};
          debugger;
          article.category = values.category;
          article.title = values.title.trim();
          article.tags = values.tags;
          article.hidden = values.hidden;
          article.path = values.path.trim();

          this.props.onOK(article);
        }
      });
      // this.setState({
      //   ModalText: "The modal will be closed after two seconds",
      //   confirmLoading: true
      // });
      // setTimeout(() => {
      //   this.setState({
      //     visible: false,
      //     confirmLoading: false
      //   });
      // }, 2000);
    };

    handleCancel = () => {
      // console.log("Clicked cancel button");
      // this.setState({
      //   visible: false
      // });
      this.props.onCancel();
    };
  }
);

export default connect(
  ({ page: { index }, article }) => ({
    visble: index.showArticleDialog,
    title: article ? "修改文章" : "新增文章",
    article
  }),
  dispatch => ({
    onOK: article => {
      dispatch({ type: "article/save", payload: article });
      dispatch({ type: "page/hidden_article_dialog" });
    },
    onCancel: () => {
      dispatch({ type: "article/hidden_article_dialog" });
      dispatch({ type: "page/hidden_article_dialog" });
    }
  })
)(ArticleDialog);
