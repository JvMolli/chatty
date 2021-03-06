/* eslint-disable arrow-parens */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { NavigationActions, StackActions } from 'react-navigation';

import GROUP_QUERY from '../graphql/group.query';
import { USER_QUERY } from '../graphql/user.query';
import DELETE_GROUP_MUTATION from '../graphql/delete-group.mutation';
import LEAVE_GROUP_MUTATION from '../graphql/leave-group.mutation';
import EDIT_NAME_GROUP_MUTATION from '../graphql/changeName-group.mutation';

import Logo from '../components/logo';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Main' })],
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImageContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 6,
    alignItems: 'center',
  },
  groupName: {
    color: 'black',
  },
  groupNameBorder: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  participants: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
  user: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    flexDirection: 'row',
    padding: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

class GroupDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { title } = navigation.state.params;

    this.state = {
      nameIsInput: `${title}`,
    };
  }

  keyExtractor = item => item.id.toString();

  renderItem = ({ item: user }) => (
    <View style={styles.user}>
      <Logo style={styles.avatar} />
      <Text style={styles.username}>{user.username}</Text>
    </View>
  );

  editGroup = group => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('DetailEdit', {
      groupId: group.id,
      name: group.name,
    });
  };

  deleteGroup = () => {
    const { deleteGroup, navigation } = this.props;
    deleteGroup(navigation.state.params.id)
      .then(() => {
        navigation.dispatch(resetAction);
      })
      .catch(e => {
        console.log(e); // eslint-disable-line no-console
      });
  };

  leaveGroup = () => {
    const { leaveGroup, navigation } = this.props;
    leaveGroup({
      id: navigation.state.params.id,
      userId: 1,
    }) // fake user for now
      .then(() => {
        navigation.dispatch(resetAction);
      })
      .catch(e => {
        console.log(e); // eslint-disable-line no-console
      });
  };

  reNameGroup = text => {
    this.setState({ nameIsInput: text });
    const { updateGroup } = this.props;
    updateGroup({
      name: this.nameIsInput,
    });
  };

  render() {
    const { group, loading } = this.props;
    const { nameIsInput } = this.state;

    // render loading placeholder while we fetch messages
    if (!group || loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={group.users}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={() => (
            <View>
              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  style={styles.groupImageContainer}
                  onPress={() => console.log('Futura Edicion de Imagen')}
                >
                  <Logo />
                  <Text>edit</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.groupNameBorder}
                  value={nameIsInput}
                  onChangeText={text => this.reNameGroup(text)}
                />
              </View>
              <Text style={styles.participants}>
                {`participants: ${group.users.length}`.toUpperCase()}
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View>
              <Button title="Leave Group" onPress={this.leaveGroup} />
              <Button title="Delete Group" onPress={this.deleteGroup} />
              <Button title="Edit Group" onPress={() => this.editGroup(group)} />
            </View>
          )}
        />
      </View>
    );
  }
}

GroupDetails.propTypes = {
  loading: PropTypes.bool,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
      }),
    ),
  }),
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        title: PropTypes.string,
        id: PropTypes.number,
      }),
    }),
  }),
  deleteGroup: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
};

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({ variables: { groupId: ownProps.navigation.state.params.id } }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});

const deleteGroupMutation = graphql(DELETE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    deleteGroup: id => mutate({
      variables: { id },
      update: (store, { data: { deleteGroup } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: USER_QUERY, variables: { id: 1 } }); // fake for now

        // Add our message from the mutation to the end.
        data.user.groups = data.user.groups.filter(g => deleteGroup.id !== g.id);

        // Write our data back to the cache.
        store.writeQuery({
          query: USER_QUERY,
          variables: { id: 1 }, // fake for now
          data,
        });
      },
    }),
  }),
});

const leaveGroupMutation = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    leaveGroup: ({ id, userId }) => mutate({
      variables: { id, userId },
      update: (store, { data: { leaveGroup } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: USER_QUERY, variables: { id: 1 } }); // fake for now

        // Add our message from the mutation to the end.
        data.user.groups = data.user.groups.filter(g => leaveGroup.id !== g.id);

        // Write our data back to the cache.
        store.writeQuery({
          query: USER_QUERY,
          variables: { id: 1 }, // fake for now
          data,
        });
      },
    }),
  }),
});

const editNameMutation = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    updateGroup: ({ name }) => mutate({
      variables: { name },
    }),
  }),
});

export default compose(
  groupQuery,
  deleteGroupMutation,
  leaveGroupMutation,
  editNameMutation,
)(GroupDetails);
