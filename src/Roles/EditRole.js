import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

const EditRole = (props) => (
  <Edit {...props}>
    <SimpleForm>
      {/* <TextInput disabled source="id" /> */}
      <TextInput source="role_name" />
      <TextInput source="role_description" />
    </SimpleForm>
  </Edit>
);

export default EditRole;
