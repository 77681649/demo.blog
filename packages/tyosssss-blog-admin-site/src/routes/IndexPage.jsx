import React from "react";
import { connect } from "dva";
import { Layout } from "antd";
import { Alert, Table, Icon, Input, Button, Divider, Tag } from "antd";
import styles from "./IndexPage.css";
import ArticileDialog from "../components/ArticleDialog";

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

function IndexPage() {
  return (
    <Layout>
      <Layout.Content>
        <div>
          <h4>文章列表</h4>
          <div>
            <Button type="primary" ghost>
              新增文章
            </Button>
          </div>
        </div>
        <div />
        <div>
          <Table
            dataSource={[
              {
                category: "Web开发",
                title: "Web 开发指南",
                path: "test.md",
                tags: ["Web", "Javascript"],
                hidden: false
              }
            ]}
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
                  <a href={`http://localhost:3000/upload/articles/${path}`}>
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
                    <Tag key={tag} color={tagColors[index % tagColors.length]}>
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
                    <a href="javascript:void 666;">编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:void 666;">删除</a>
                  </span>
                )
              }
            ]}
          />
        </div>
        <ArticileDialog />
      </Layout.Content>
    </Layout>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
