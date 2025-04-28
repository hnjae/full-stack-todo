// NOTE: This page assumes that the user is logged in when loaded.

import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { MenuProps, ModalProps } from 'antd';
import {
  ConfigProvider,
  Divider,
  Dropdown,
  Input,
  Layout,
  Modal,
  theme,
  Tree,
  TreeDataNode,
  TreeProps,
} from 'antd';
import { useMemo, useState } from 'react';
import {
  TodoList,
  UpdateTodoList,
  useAddTodoListMutation,
  useBatchUpdateTodoListMutation,
  useDeleteTodoListMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';
import { MainHeader } from 'src/widgets/header';

const { Content, Sider } = Layout;

const MIN_INTEGER = -2147483648; // -2^31
const MAX_INTEGER = 2147483647; // 2^31 - 1 (4 byte integer)
const ORDER_DEFAULT_SPACING = 65536; // 2^16

const generateUniqueName = function (
  proposedName: string,
  items: readonly { name: string }[],
): string {
  if (items.length === 0) {
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

const balanceItems = function <T extends { order: number }>(
  sortedItems: readonly T[],
): T[] {
  if (sortedItems.length === 0) {
    return [];
  }

  const newOrderMin =
    -Math.floor(sortedItems.length / 2) * ORDER_DEFAULT_SPACING;

  return sortedItems.map((item, idx) => {
    return { ...item, order: newOrderMin + ORDER_DEFAULT_SPACING * idx };
  });
};

interface ModalState {
  title?: string;
  open: boolean;
  children?: React.ReactNode;
  onOk?: ModalProps['onOk'];
}

interface TodoListRenameModalState {
  id: string | null;
}

export default function WebAppPage() {
  const { token } = theme.useToken();

  const {
    data: todoLists,
    isLoading: isGetTodoListsLoading,
    isFetching: isGetTodoListsFetching,
  } = useGetTodoListsQuery();

  const [addTodoList, addTodoListResult] = useAddTodoListMutation({
    fixedCacheKey: 'addTodoList',
  });
  const [batchUpdateTodoList, batchUpdateTodoListResult] =
    useBatchUpdateTodoListMutation({
      fixedCacheKey: 'batchUpdateTodoList',
    });
  const [deleteTodoList, deleteTodoListResult] = useDeleteTodoListMutation({
    fixedCacheKey: 'deleteTodoList',
  });
  const [todoListSelectedKey, setTodoListSelectedKey] =
    useState<React.Key | null>(null);

  const [modalState, setModalState] = useState<ModalState>({
    open: false,
  });

  const [todoListRenameModal, setTodoListRenameModal] =
    useState<TodoListRenameModalState>({ id: null });

  const [newListInputValue, setNewListInputValue] = useState('');
  const [inputModalValue, setInputModalValue] = useState('');

  const handleRename = function (todoList: TodoList) {
    setInputModalValue('');
    setTodoListRenameModal({
      id: todoList.id,
    });
  };

  const handleDelete = function (todoList: TodoList) {
    setModalState({
      title: 'Delete todo list?',
      open: true,
      children: (
        <p>
          <b>"{todoList.name}"</b> will be permanently deleted.
        </p>
      ),
      onOk: () => {
        console.log('Deleting todo list with ID:', todoList.id);
        deleteTodoList(todoList.id);
        setModalState({ open: false });
      },
    });
  };

  const todoListTreeData: TreeDataNode[] | undefined = useMemo(() => {
    // NOTE: todoLists is already sorted by `order``
    return todoLists?.map((todoList) => {
      const menuItems: MenuProps['items'] = [
        {
          icon: <EditOutlined />,
          label: 'Rename',
          key: 'rename',
          onClick: () => {
            handleRename(todoList);
          },
        },
        {
          icon: <DeleteOutlined />,
          label: 'Delete',
          key: 'delete',
          danger: true,
          onClick: () => {
            handleDelete(todoList);
          },
        },
      ];
      return {
        key: todoList.id,
        title: (
          <div
            style={{
              display: 'flex',
              gap: '2px', // Adds space between the two main flex items
            }}
          >
            <div
              style={{
                flexGrow: 1,
                width: 0,
              }}
            >
              <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
                <div
                  style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'block',
                  }}
                >
                  {todoList.name}
                </div>
              </Dropdown>
            </div>
            <div
              style={{
                flexShrink: 0,
              }}
            >
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                  <EllipsisOutlined
                    style={{
                      color: token.colorIcon,
                      verticalAlign: 'middle',
                    }}
                  />
                </a>
              </Dropdown>
            </div>
          </div>
        ),
        disableCheckbox: true,
      };
    });
  }, [todoLists]);

  // TODO: change selected list <2025-04-02>
  const handleEnter = async function (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    let proposedName = event.currentTarget.value.trim();
    if (proposedName === '') {
      proposedName = 'New List';
    }

    let order = 0;
    let name = proposedName;

    if (todoLists != null && todoLists.length > 0) {
      const lastOrder = todoLists[todoLists.length - 1].order;
      name = generateUniqueName(proposedName, todoLists);

      if (lastOrder <= MAX_INTEGER - ORDER_DEFAULT_SPACING) {
        order = lastOrder + ORDER_DEFAULT_SPACING;
      } else {
        console.log('Balancing todo-lists');

        const balancedLists = balanceItems(todoLists);

        const updateTodoLists = balancedLists.map((todoList) => ({
          id: todoList.id,
          payload: {
            order: todoList.order,
          },
        }));
        batchUpdateTodoList(updateTodoLists);

        order = balancedLists[balancedLists.length - 1].order;
      }
    }

    try {
      const newTodoList = await addTodoList({
        name: name,
        order: order,
      }).unwrap();
      setTodoListSelectedKey(newTodoList.id);
      console.log('New todo list added:', newTodoList);
    } catch (error) {
      console.log('Error adding todo list:', error);
    }

    setNewListInputValue('');
  };

  const onDrop: TreeProps['onDrop'] = function (info) {
    if (todoLists == null || todoLists.length === 0) {
      return;
    }

    // NOTE: const dropPos = info.dropPosition; // e.g.) -1, 1, ,2 ,3
    const dropPosIdx = info.dropPosition === -1 ? 0 : info.dropPosition;
    const dragNodePosIdx = Number(info.dragNode.pos.split('-')[1]);
    const dragNodeKey = info.dragNode.key;

    if (dragNodePosIdx === dropPosIdx) {
      return;
    }

    let updateTodoLists: UpdateTodoList[];

    // Drop at the beginning
    if (dropPosIdx === 0) {
      let newOrder;

      if (todoLists[0].order >= MIN_INTEGER + ORDER_DEFAULT_SPACING) {
        updateTodoLists = [];
        newOrder = todoLists[0].order - ORDER_DEFAULT_SPACING;
      } else {
        console.log('Balancing todo-lists');

        updateTodoLists = balanceItems(todoLists)
          .filter((todoList) => todoList.id !== dragNodeKey)
          .map((todoList) => ({
            id: todoList.id,
            payload: {
              order: todoList.order,
            },
          }));

        newOrder = todoLists[0].order - ORDER_DEFAULT_SPACING;
      }

      updateTodoLists.push({
        id: dragNodeKey as string,
        payload: {
          order: newOrder,
        },
      });

      // Drop at the end
    } else if (dropPosIdx === todoLists.length) {
      let newOrder;

      if (
        todoLists[todoLists.length - 1].order <=
        MAX_INTEGER - ORDER_DEFAULT_SPACING
      ) {
        updateTodoLists = [];
        newOrder =
          todoLists[todoLists.length - 1].order + ORDER_DEFAULT_SPACING;
      } else {
        console.log('Balancing todo-lists');
        updateTodoLists = balanceItems(todoLists)
          .filter((todoList) => todoList.id !== dragNodeKey)
          .map((todoList) => ({
            id: todoList.id,
            payload: {
              order: todoList.order,
            },
          }));

        newOrder =
          todoLists[todoLists.length - 1].order + ORDER_DEFAULT_SPACING;
      }

      updateTodoLists.push({
        id: dragNodeKey as string,
        payload: {
          order: newOrder,
        },
      });

      // Drop in the middle
    } else {
      let before = todoLists[dropPosIdx - 1].order;
      let after = todoLists[dropPosIdx].order;

      if (after - before > 1) {
        updateTodoLists = [];
      } else {
        console.log('Balancing todo-lists');
        const balancedLists = balanceItems(todoLists);

        updateTodoLists = balancedLists
          .filter((todoList) => todoList.id !== dragNodeKey)
          .map((todoList) => ({
            id: todoList.id,
            payload: {
              order: todoList.order,
            },
          }));

        before = balancedLists[dropPosIdx - 1].order;
        after = balancedLists[dropPosIdx].order;
      }

      const newOrder = Math.floor((after - before) / 2) + before;
      updateTodoLists.push({
        id: dragNodeKey as string,
        payload: {
          order: newOrder,
        },
      });
    }

    if (updateTodoLists.length !== 0) {
      batchUpdateTodoList(updateTodoLists);
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
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
                  paddingTop: '8px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                <ConfigProvider
                  theme={{
                    token: {
                      fontSize: 15, // default: 14
                    },
                    components: {
                      Tree: {
                        titleHeight: 32, // default: 24
                      },
                    },
                  }}
                >
                  <Tree
                    className="todo-list-tree"
                    draggable
                    allowDrop={({ dropPosition }) => dropPosition !== 0}
                    blockNode
                    onDragStart={({ event, node }) => {
                      setTodoListSelectedKey(node.key);
                    }}
                    onSelect={(selectedKeys) => {
                      if (selectedKeys.length === 0) {
                        return;
                      }

                      setTodoListSelectedKey(selectedKeys[0]);
                    }}
                    selectedKeys={
                      todoListSelectedKey != null
                        ? [todoListSelectedKey]
                        : todoLists?.[0]?.id != null
                          ? [todoLists?.[0]?.id]
                          : undefined
                    }
                    onDrop={onDrop}
                    treeData={todoListTreeData}
                  />
                </ConfigProvider>
              </div>

              <div style={{ flexShrink: 0 }}>
                {todoLists != null && todoLists.length > 0 ? <Divider /> : null}

                <Input
                  addonBefore={<PlusOutlined />}
                  placeholder="New List"
                  variant="filled"
                  value={newListInputValue}
                  onPressEnter={handleEnter}
                  onChange={(event) => setNewListInputValue(event.target.value)}
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
            {isGetTodoListsLoading ||
            addTodoListResult.isLoading ||
            batchUpdateTodoListResult.isLoading ||
            deleteTodoListResult.isLoading ? (
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
      <Modal
        title={modalState.title}
        open={modalState.open}
        onOk={modalState.onOk}
        onCancel={() => {
          setModalState({
            open: false,
          });
        }}
      >
        {modalState.children}
      </Modal>
      <Modal
        title="Rename todo list:"
        open={todoListRenameModal.id != null}
        onOk={() => {
          if (inputModalValue === '' || todoListRenameModal.id == null) {
            return;
          }

          batchUpdateTodoList([
            {
              id: todoListRenameModal.id,
              payload: {
                name: generateUniqueName(inputModalValue, todoLists ?? []),
              },
            },
          ]);

          setTodoListRenameModal({ id: null });
        }}
        onCancel={() => {
          setTodoListRenameModal({ id: null });
        }}
      >
        <Input
          placeholder="New name"
          autoFocus
          value={inputModalValue}
          onChange={(event) => {
            setInputModalValue(event.target.value);
          }}
          onPressEnter={() => {
            if (inputModalValue === '' || todoListRenameModal.id == null) {
              return;
            }

            batchUpdateTodoList([
              {
                id: todoListRenameModal.id,
                payload: {
                  name: generateUniqueName(inputModalValue, todoLists ?? []),
                },
              },
            ]);

            setTodoListRenameModal({ id: null });
          }}
        />
      </Modal>
    </>
  );
}
