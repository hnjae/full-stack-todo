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
  useAddTodoListMutation,
  useBatchUpdateTodoListMutation,
  useDeleteTodoListMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';
import {
  RenameTodoListModal,
  RenameTodoListModalState,
  useHandleAddingTodoList,
  useReorderTodoList,
} from 'src/features/todo-list';
import { MainHeader } from 'src/widgets/header';

const { Content, Sider } = Layout;

interface ModalState {
  title?: string;
  open: boolean;
  children?: React.ReactNode;
  onOk?: ModalProps['onOk'];
}

export default function WebAppPage() {
  const { token } = theme.useToken();

  const {
    data: todoLists,
    isLoading: isGetTodoListsLoading,
    isFetching: isGetTodoListsFetching,
  } = useGetTodoListsQuery();

  const [deleteTodoList, deleteTodoListResult] = useDeleteTodoListMutation({
    fixedCacheKey: 'deleteTodoList',
  });
  const [todoListSelectedKey, setTodoListSelectedKey] =
    useState<React.Key | null>(null);

  const [modalState, setModalState] = useState<ModalState>({
    open: false,
  });
  const [renameTodoListModalState, setRenameTodoListModalState] =
    useState<RenameTodoListModalState>(null);

  const reorderTodoList = useReorderTodoList();
  const handleAddingTodoList = useHandleAddingTodoList();

  const [newListInputValue, setNewListInputValue] = useState('');

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
            setRenameTodoListModalState(todoList);
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

  const handleEnter = async function (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    let proposedName = event.currentTarget.value.trim();

    if (proposedName === '') {
      proposedName = 'New List';
    }

    const newTodoList = await handleAddingTodoList(proposedName);
    setTodoListSelectedKey(newTodoList.id);
    setNewListInputValue('');
  };

  const onDrop: TreeProps['onDrop'] = function (info) {
    // NOTE: const dropPos = info.dropPosition; // e.g.) -1, 1, ,2 ,3
    const dropPosIdx = info.dropPosition === -1 ? 0 : info.dropPosition;
    const dragNodePosIdx = Number(info.dragNode.pos.split('-')[1]);
    const dragNodeKey = info.dragNode.key;

    reorderTodoList({
      dropPosIdx,
      dragListPosIdx: dragNodePosIdx,
      dragListKey: dragNodeKey,
    });
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
            {isGetTodoListsLoading || deleteTodoListResult.isLoading ? (
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
      <RenameTodoListModal
        modalState={renameTodoListModalState}
        setModalState={setRenameTodoListModalState}
      />
    </>
  );
}
