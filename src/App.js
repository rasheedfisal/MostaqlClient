import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
//import jsonServerProvider from "ra-data-json-server";
import { UserList, UserEdit } from "./Users/users";
import RoleList from "./Roles/RoleList";
import EditRole from "./Roles/EditRole";
//import { PostList, PostEdit, PostCreate } from "./post";
//import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import Dashboard from "./Dashboard";
import authProvider from "./authProvider";
import myDataProvider from "./dataProvider";
import Login from "./layout/Login";

//const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const dataProvider = myDataProvider("http://localhost:3000/api/v1");
const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    dashboard={Dashboard}
    loginPage={Login}
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      recordRepresentation="name"
      icon={UserIcon}
    />
    <Resource name="roles" list={RoleList} edit={EditRole} icon={UserIcon} />
  </Admin>
);

export default App;
