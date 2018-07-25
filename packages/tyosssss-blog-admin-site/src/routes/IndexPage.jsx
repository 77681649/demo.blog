import React from "react";
import { connect } from "dva";
import { Layout } from "antd";
import { Alert, Table, Icon, Input, Button, Divider, Tag } from "antd";
import styles from "./IndexPage.css";
import ArticleDialog from "../components/ArticleDialog";
import { debug } from "util";

const categories = [
  { id: "1", name: "Web" },
  { id: "2", name: "iOS" },
  { id: "3", name: "Java" }
];

const tagColors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple"
];

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.hanldePaginationChange = this.hanldePaginationChange.bind(this);
  }

  state = {
    pageIndex: 0
  };

  componentDidMount() {
    this.props.fetch();
  }

  render() {
    const { props } = this;
    return (
      <Layout>
        <Layout.Content>
          <div>
            <h4>文章列表</h4>
            <div>
              <Button
                type="primary"
                ghost
                onClick={() => props.showArticle(null)}
              >
                新增文章4
              </Button>
            </div>
          </div>
          <div>
            <Table
              rowKey="_id"
              dataSource={
                props.articles
                  ? props.articles.map(a => {
                      let category = categories.find(c => c.id == a.category);
                      a.category = category ? category.name : "";
                      return a;
                    })
                  : null
              }
              pagination={{
                pageSize: props.pageSize,
                pageIndex: this.state.pageIndex,
                total: props.articles ? props.articles.length : 0
              }}
              onChange={this.hanldePaginationChange}
              columns={[
                {
                  title: "分类",
                  dataIndex: "category",
                  key: "category"
                },
                {
                  title: "标题",
                  dataIndex: "title",
                  key: "title"
                },
                {
                  title: "路径",
                  dataIndex: "path",
                  key: "path",
                  render: path => (
                    <a
                      href={`http://localhost:3000/upload/articles/${path}`}
                      target="_blank"
                    >
                      {path}
                    </a>
                  )
                },
                {
                  title: "标签",
                  dataIndex: "tags",
                  key: "tags",
                  render: tags =>
                    tags.map((tag, index) => (
                      <Tag
                        key={tag}
                        color={tagColors[index % tagColors.length]}
                      >
                        {tag}
                      </Tag>
                    ))
                },
                {
                  key: "action",
                  title: "",
                  dataIndex: "action",
                  render: (text, record) => (
                    <span>
                      <a
                        href="javascript:void 666;"
                        onClick={() => props.showArticle(record)}
                      >
                        编辑
                      </a>
                      <Divider type="vertical" />
                      <a href="javascript:void 666;">删除</a>
                    </span>
                  )
                }
              ]}
            />
          </div>
          <ArticleDialog />
        </Layout.Content>
      </Layout>
    );
  }

  hanldePaginationChange(page, pageSize) {
    const pageIndex = page.current - 1;

    this.setState({
      pageIndex: pageIndex
    });
    this.props.onPaginationChange(pageIndex);
  }
}

IndexPage.propTypes = {};

export default connect(
  ({ articles }) => ({
    pageSize: articles.pageSize,
    articles: articles.data
  }),
  dispatch => ({
    fetch() {
      dispatch({ type: "articles/fetch", payload: { pageIndex: 0 } });
    },
    onPaginationChange(pageIndex) {
      debugger;
      dispatch({ type: "articles/fetch", payload: { pageIndex } });
    },
    showArticle: article => {
      dispatch({ type: "article/show_article_dialog", article: article });
      dispatch({ type: "page/show_article_dialog" });
    }
  })
)(IndexPage);
