import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
  ConfigProvider,
  Divider,
  Dropdown,
  Input,
  Layout,
  theme,
  Tree,
  TreeDataNode,
  TreeProps,
} from 'antd';
import { useMemo, useState } from 'react';
import { useGetTodoListsQuery } from 'src/entities/todo-list';
import {
  DeleteTodoListModalState,
  RenameTodoListModalState,
  useHandleAddingTodoList,
  useReorderTodoList,
} from 'src/features/todo-list';

const { Sider } = Layout;

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export default function TodoListSidebar({
  selectedTodoListId,
  setSelectedTodoListId,
  setRenameTodoListModalState,
  setDeleteTodoListModalState,
}: {
  selectedTodoListId: string | null;
  setSelectedTodoListId: SetState<string | null>;
  setRenameTodoListModalState: SetState<RenameTodoListModalState>;
  setDeleteTodoListModalState: SetState<DeleteTodoListModalState>;
}) {
  const { data: todoLists } = useGetTodoListsQuery();

  const reorderTodoList = useReorderTodoList();
  const handleAddingTodoList = useHandleAddingTodoList();
  const [newListInputValue, setNewListInputValue] = useState('');

  const { token } = theme.useToken();

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
            setDeleteTodoListModalState(todoList);
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

  const handleEnter = async function (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    let proposedName = event.currentTarget.value.trim();

    if (proposedName === '') {
      proposedName = 'New List';
    }

    const newTodoList = await handleAddingTodoList(proposedName);
    setSelectedTodoListId(newTodoList.id);
    setNewListInputValue('');
  };

  return (
    <Sider
      collapsed={false}
      style={{
        background: token.colorBgContainer,
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
              onDragStart={({ node }) => {
                setSelectedTodoListId(node.key as string);
              }}
              onSelect={(selectedKeys) => {
                if (selectedKeys.length === 0) {
                  return;
                }

                setSelectedTodoListId(selectedKeys[0] as string);
              }}
              selectedKeys={
                selectedTodoListId != null
                  ? [selectedTodoListId]
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
  );
}
