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
      const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'rename') setRenameTodoListModalState(todoList);
        if (key === 'delete') setDeleteTodoListModalState(todoList);
      };

      const menuItems: MenuProps['items'] = [
        {
          icon: <EditOutlined />,
          label: 'Rename',
          key: 'rename',
        },
        {
          icon: <DeleteOutlined />,
          label: 'Delete',
          key: 'delete',
          danger: true,
        },
      ];

      return {
        key: todoList.id,
        title: (
          <div className="flex gap-x-2">
            <div className="grow-1 w-0">
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={['contextMenu']}
              >
                <div className="text-ellipsis whitespace-nowrap overflow-hidden block">
                  {todoList.name}
                </div>
              </Dropdown>
            </div>
            <div className="shrink-0">
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={['click']}
              >
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
      <div className="flex flex-col h-full">
        <div className="p-1 pt-2 overflow-y-auto overflow-x-hidden">
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
                selectedTodoListId != null ? [selectedTodoListId] : undefined
              }
              onDrop={onDrop}
              treeData={todoListTreeData}
            />
          </ConfigProvider>
        </div>

        <div className="shrink-0">
          {todoLists != null && todoLists.length > 0 ? <Divider /> : null}

          <Input
            addonBefore={<PlusOutlined />}
            placeholder="New List"
            variant="filled"
            value={newListInputValue}
            onPressEnter={handleEnter}
            onChange={(event) => setNewListInputValue(event.target.value)}
            className="pl-1 pr-1"
          />
        </div>
      </div>
    </Sider>
  );
}
