import * as React from "react";
import { useMediaQuery } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  ReferenceInput,
  SimpleForm,
  TextInput,
  Edit,
  Create,
  SimpleList,
} from "react-admin";

export const PostList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.title}
          secondaryText={(record) => (
            <ReferenceField label="User" source="userId" reference="users" />
          )}
        />
      ) : (
        <Datagrid rowClick="edit">
          <TextField source="id" />
          <ReferenceField source="userId" reference="users" />
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="body" />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};

export const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="title" />
      <TextInput source="body" />
    </SimpleForm>
  </Edit>
);

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Create>
);
