import gql from 'graphql-tag';

const EDIT_NAME_GROUP_MUTATION = gql`
  mutation updateGroup($group: UpdateGroupInput!) {
    updateGroup(group: $group) {
      id
      name
    }
  }
`;

export default EDIT_NAME_GROUP_MUTATION;
