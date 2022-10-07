import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  UrlField,
  TextInput,
  SimpleForm,
  Edit,
  ReferenceInput,
} from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="fullname" />
      <EmailField source="email" />
      <TextField source="Role.role_name" />
      {/* <TextField source="address.street" /> */}
      {/* <TextField source="phone" />
      <UrlField source="website" /> */}
      {/* <TextField source="company.name" /> */}
    </Datagrid>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      {/* ddl Info */}
      {/* <ReferenceInput disabled source="id" reference="users" /> */}
      <TextInput disabled source="id" />
      <TextInput source="fullname" />
      <TextInput source="email" />
    </SimpleForm>
  </Edit>
);
