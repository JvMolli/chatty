import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { NavigationActions, StackActions, NavigationOptions } from 'react-navigation';

import GROUP_QUERY from '../graphql/group.query';
import { USER_QUERY } from '../graphql/user.query';
import DELETE_GROUP_MUTATION from '../graphql/delete-group.mutation';
import LEAVE_GROUP_MUTATION from '../graphql/leave-group.mutation';

import Logo from '../components/logo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerNameAndPhoto: {
    flexDirection: 'row',
    flex: 0.3,
    backgroundColor: 'yellow',
  },
  containerName: {
    flex: 0.7,
    backgroundColor: 'red',
  },
  containerPhoto: {
    flex: 0.3,
    backgroundColor: 'black',
  },

  containerImages: {
    flexDirection: 'column',
    flex: 0.7,
    backgroundColor: 'yellow',
  },
  containerCadaFoto: {
    flexDirection: 'column',
    flex: 0.2,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class DetailEdit extends Component {
  static NavigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'New Group',
    };
  };

  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerNameAndPhoto}>
          <View style={styles.containerName} />
          <View style={styles.containerPhoto} />
        </View>

        <View style={styles.containerImages}>
          <View style={styles.containerCadaFoto} />
          <View style={styles.containerCadaFoto}>
            <Text>BUTTON</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default DetailEdit;
