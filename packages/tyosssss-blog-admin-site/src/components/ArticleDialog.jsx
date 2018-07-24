import React from "react";
import { connect } from "dva";
import { Modal, Form, Input, Select, Switch, Upload, Button, Icon } from "antd";

const { Option } = Select;
const categories = [
  { id: 1, name: "Web" },
  { id: 2, name: "iOS" },
  { id: 3, name: "Java" }
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
    }

    render() {
      const { visble, title } = this.props;
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
                initialValue: 1,
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
                rules: [{ required: true, message: "标题不能为空" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="tags" {...formItemLayout}>
              {getFieldDecorator("tags", {})(<Input />)}
            </Form.Item>
            <Form.Item label="是否可见" {...formItemLayout}>
              {getFieldDecorator("hidden", {})(
                <Switch defaultChecked={true} />
              )}
            </Form.Item>
            <Form.Item label="文章内容" {...formItemLayout}>
              {getFieldDecorator("file", {
                rules: [{ required: true, message: "请上传文件" }]
              })(
                <Upload action="http://localhost:3000/api/article/file">
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

    handleOk = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onOK();
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
      dispatch({ type: "article/hidden_article_dialog" });
      dispatch({ type: "page/hidden_article_dialog" });
    },
    onCancel: () => {
      dispatch({ type: "article/hidden_article_dialog" });
      dispatch({ type: "page/hidden_article_dialog" });
    }
  })
)(ArticleDialog);
