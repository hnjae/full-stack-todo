// NOTE: This page assumes that the user is logged in when loaded.

import { Layout, theme } from 'antd';
import { useGetTodoListsQuery } from 'src/entities/todo-list';
import { useGetUserInfoQuery } from 'src/entities/user';
import { MainHeader } from 'src/widgets/header';

const { Content } = Layout;

export default function WebAppPage() {
  const { token } = theme.useToken();

  const { data: user, isLoading, isFetching, isError } = useGetUserInfoQuery();
  const { data: todoLists } = useGetTodoListsQuery();

  return (
    <Layout
      style={{
        height: '100dvh',
      }}
    >
      <MainHeader />
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
        <p>
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
        </p>
        <br />
        <p>
          {todoLists != null ? (
            <div>
              <br />
              <ul>
                {todoLists.map((todoList) => (
                  <li key={todoList.id}>
                    <div>
                      Todo List Id: {todoList.id}
                      <br />
                      Todo List Name: {todoList.name}
                      <br />
                      Todo List Order: {todoList.order}
                      <br />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>no todo list</div>
          )}
        </p>
      </Content>
    </Layout>
  );
}
