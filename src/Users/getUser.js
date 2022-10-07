import * as React from "react";
import { ReferenceField, TextField } from "react-admin";

const UserReferenceField = (props) => (
  <ReferenceField label="User" source="uid" reference="users" {...props}>
    <TextField source="reference" />
  </ReferenceField>
);

UserReferenceField.defaultProps = {
  source: "uid",
};

export default UserReferenceField;
