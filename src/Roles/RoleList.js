import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  // EmailField,
  // UrlField,
  // TextInput,
  // SimpleForm,
  // Edit,
  // ReferenceInput,
} from "react-admin";

const RoleList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="role_name" />
      <TextField source="role_description" />
      <EditButton label="Edit" />
    </Datagrid>
  </List>
);

export default RoleList;
