import React from "react";
import { connect } from "dva";
import { Layout } from "antd";
import { Alert, Form, Icon, Input, Button } from "antd";
import styles from "./LoginPage.less";

class LoginPage extends React.Component {
  state = {
    showAlert: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return { ...prevState, showAlert: nextProps.hasError };
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout className={styles.login}>
        <Layout.Content>
          <div className={styles["login-box"]}>
            <div>登录到BLOG</div>
            <div>
              {this.state.showAlert ? (
                <Alert
                  type="error"
                  closable
                  showIcon
                  visible={this.props.hasError}
                  message={`登录失败: ${this.props.errmessage}`}
                  onClose={() => this.setState({ showAlert: false })}
                />
              ) : null}
              <Form onSubmit={this.handleSubmit.bind(this)}>
                <Form.Item>
                  {getFieldDecorator("username", {
                    rules: [
                      {
                        required: true,
                        message: "请输入用户名"
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="用户名"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "请输入密码"
                      }
                    ]
                  })(
                    <Input
                      type="password"
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="密码"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={this.props.logining}
                    type="primary"
                    htmlType="submit"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Layout.Content>
        <Layout.Footer />
      </Layout>
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values.username, values.password);
      }
    });
  };
}

LoginPage.propTypes = {};

export default connect(
  function mapStateToProps({ user: { logining, errmessage } }) {
    return {
      logining,
      hasError: !!errmessage,
      errmessage
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      login: (username, password) => {
        dispatch({
          type: "user/login",
          payload: { username, password }
        });
      }
    };
  }
)(Form.create()(LoginPage));
