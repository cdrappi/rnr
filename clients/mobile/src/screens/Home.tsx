import { FontAwesome } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { Animated, RefreshControl, StyleSheet, View } from 'react-native';
// components
import AlbumsHorizontal from '../components/AlbumsHorizontal';
import { colors, device, gStyle } from '../constants';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      refreshing: false
    };
    this.toItems = this.toItems.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.screenProps.onRefresh();
    this.setState({ refreshing: false });
  }

  toItems(itemIds) {
    const { screenProps } = this.props;
    return itemIds.map(itemId => screenProps.data.items[itemId]);
  }

  render() {
    const { navigation, screenProps } = this.props;
    const { scrollY, refreshing } = this.state;

    const opacityIn = scrollY.interpolate({
      inputRange: [0, 128],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    const opacityOut = scrollY.interpolate({
      inputRange: [0, 88],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    return (
      <React.Fragment>
        {/* {device.iPhoneX && (
          <Animated.View style={[styles.iPhoneNotch, { opacity: opacityIn }]} />
        )} */}

        <Animated.View
          style={[styles.containerHeader, { opacity: opacityOut }]}
        >
          <FontAwesome color={colors.white} name="cog" size={28} />
        </Animated.View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            ></RefreshControl>
          }
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={gStyle.container}
        >
          <View style={gStyle.spacer16} />

          <AlbumsHorizontal
            data={this.toItems(
              screenProps.data.biggest_waitlists.map(wl => wl.item_id)
            )}
            heading="Recently played"
            navigation={navigation}
          />

          <AlbumsHorizontal
            data={this.toItems(
              screenProps.data.home_lists.recently_played.item_ids
            )}
            heading="Recently played"
            navigation={navigation}
          />

          <AlbumsHorizontal
            data={this.toItems(
              screenProps.data.home_lists.heavy_rotation.item_ids
            )}
            heading="Your heavy rotation"
            navigation={navigation}
            tagline="The music you've had on repeat this month."
          />

          <AlbumsHorizontal
            data={this.toItems(
              screenProps.data.home_lists.jump_back_in.item_ids
            )}
            heading="Jump back in"
            navigation={navigation}
            tagline="Your top listens from the past few months."
          />
        </Animated.ScrollView>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  iPhoneNotch: {
    backgroundColor: colors.black70,
    height: 44,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 20
  },
  containerHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: device.iPhoneX ? 60 : 36,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  }
});

export default Home;
