import React from "react";
import { connect } from "dva";
import { Modal, Form, Button, Input } from "antd";

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
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          sdfsdf
        </Modal>
      );
    }

    handleOk = () => {
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
      this.props.onOK();
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
