import React from "react";
import { Modal, Form, Button, Input } from "antd";

export default Form.create()(
  class ArticleDialog extends React.Component {
    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <Modal title={this.props.title} maskClosable={false}>
          sdfsdf 
        </Modal>
      );
    }
  }
);
