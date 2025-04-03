// NOTE: This page assumes that the user is logged in when loaded.

import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Layout, theme, Tree, TreeDataNode } from 'antd';
import { useMemo, useState } from 'react';
import {
  useAddTodoListMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';
// import { useGetUserInfoQuery } from 'src/entities/user';
import { MainHeader } from 'src/widgets/header';

const { Content, Sider } = Layout;

interface OrderedItem {
  order: number;
  name: string;
}

const generateUniqueName = function (
  proposedName: string,
  items: readonly OrderedItem[] | undefined,
): string {
  if (items == null || items.length === 0) {
    return proposedName;
  }

  const names = new Set(items.map((item) => item.name));

  if (!names.has(proposedName)) {
    return proposedName;
  }

  let idx = 1;
  let potentialName = `${proposedName} (${idx})`;
  while (names.has(potentialName)) {
    idx += 1;
    potentialName = `${proposedName} (${idx})`;
  }

  return potentialName;
};

const calculateNewItemsOrder = function (
  sortedItems: readonly OrderedItem[] | undefined,
): number {
  if (sortedItems == null || sortedItems.length === 0) {
    return 0;
  }

  return sortedItems[sortedItems.length - 1].order + 1;
};

export default function WebAppPage() {
  const { token } = theme.useToken();

  // const { data: user, isLoading, isFetching, isError } = useGetUserInfoQuery();
  const {
    data: todoLists,
    isLoading: isGetTodoListsLoading,
    isFetching: isGetTodoListsFetching,
  } = useGetTodoListsQuery();
  const [addTodoListTrigger, { isLoading: isAddTodoListsLoading }] =
    useAddTodoListMutation();
  const [inputValue, setInputValue] = useState('');

  const todoListTreeData: TreeDataNode[] | undefined = useMemo(() => {
    // NOTE: todoLists is aleady sorted by order
    return todoLists?.map((todoList) => {
      return {
        key: todoList.id,
        title: todoList.name,
        disableCheckbox: true,
      };
    });
  }, [todoLists]);

  // TODO: change selected list <2025-04-02>
  const handleEnter = function (event: React.KeyboardEvent<HTMLInputElement>) {
    let proposedName = event.currentTarget.value.trim();
    if (proposedName === '') {
      proposedName = 'New List';
    }

    addTodoListTrigger({
      name: generateUniqueName(proposedName, todoLists),
      order: calculateNewItemsOrder(todoLists),
    });
    setInputValue('');
  };

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
            <br />
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
              {todoLists != null && todoLists.length > 0 ? <Divider /> : null}

              <Input
                addonBefore={<PlusOutlined />}
                placeholder="New List"
                variant="filled"
                value={inputValue}
                onPressEnter={handleEnter}
                onChange={(event) => setInputValue(event.target.value)}
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
          {isGetTodoListsLoading && isAddTodoListsLoading ? (
            <div>
              Loading ... <br />
            </div>
          ) : (
            <div>
              Not Loading <br />
            </div>
          )}
          {isGetTodoListsFetching ? (
            <div>
              Fetching ...
              <br />
            </div>
          ) : (
            <div>
              Not Fetching
              <br />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
