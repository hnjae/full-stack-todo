// NOTE: This page assumes that the user is logged in when loaded.

import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Layout, theme, Tree, TreeDataNode } from 'antd';
import { useMemo, useState } from 'react';
import { useGetTodoListsQuery } from 'src/entities/todo-list';
import { useGetUserInfoQuery } from 'src/entities/user';
import { MainHeader } from 'src/widgets/header';

const { Content, Sider } = Layout;

export default function WebAppPage() {
  const { token } = theme.useToken();

  const { data: user, isLoading, isFetching, isError } = useGetUserInfoQuery();
  // TODO: loading 중일때는 화면에 표기 <2025-03-31>
  const { data: todoLists, isTodoListLoading } = useGetTodoListsQuery();

  const todoListTreeData: TreeDataNode[] | undefined = useMemo(() => {
    return todoLists
      ?.slice()
      .sort((a, b) => a.order - b.order)
      .map((todoList) => {
        return {
          key: todoList.id,
          title: todoList.name,
          disableCheckbox: true,
        };
      });
  }, [todoLists]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        height: '97dvh',
      }}
    >
      <MainHeader />
      <Layout>
        <Sider
          collapsed={false}
          style={{
            background: colorBgContainer,
          }}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <Tree
                className="draggable-tree"
                draggable
                blockNode
                defaultSelectedKeys={
                  todoListTreeData?.[0] != null
                    ? [todoListTreeData[0].key]
                    : undefined
                }
                // defaultExpandedKeys={expandedKeys}
                // onDragEnter={onDragEnter}
                // onDrop={onDrop}
                treeData={todoListTreeData}
              />
            </div>

            <div style={{ flexShrink: 0 }}>
              <Divider />

              <Input
                addonBefore={<PlusOutlined />}
                placeholder="New List"
                variant="filled"
                style={{
                  paddingRight: '8px',
                }}
              />
            </div>
          </div>
        </Sider>
        <Content
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '20vh',
            background: `color-mix(in srgb, ${token.colorBgLayout}, black 2%)`,
          }}
        >
          <div>
            <p>Todo-app should be implemented here</p>
            <ul>
              <li>
                {isFetching ? 'Fetching User Info...' : <div>not fetching</div>}
              </li>
              <li>
                {isLoading ? 'Loading User Info...' : <div>not loading</div>}
              </li>
              <li>
                {isError ? 'Error loading user info...' : <div>not error</div>}
              </li>
            </ul>
          </div>
          <div>
            {user != null ? (
              <div>
                <br />
                User Id: {user.id}
                <br />
                User Email: {user.email}
                <br />
                User createdAt: {user.createdAt}
              </div>
            ) : null}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
