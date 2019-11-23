import PropTypes from 'prop-types';
import React from 'react';
import { createStackNavigator } from 'react-navigation';
// icons
import SvgTabHome from '../components/icons/Svg.TabHome';
import Album from '../screens/Album';
// screens
import Home from '../screens/Home';

const Icon = ({ focused }) => <SvgTabHome active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    Home,
    Album
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: Icon
    }
  }
);
