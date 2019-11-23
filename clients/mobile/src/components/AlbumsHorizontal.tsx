import PropTypes from 'prop-types';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, gStyle } from '../constants';

function renderItem(navigation, itemObj) {
  const { item } = itemObj;
  return (
    <TouchableOpacity
      activeOpacity={gStyle.activeOpacity}
      hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
      onPress={() => navigation.navigate('Album', { title: item.name })}
      style={styles.item}
    >
      <View style={styles.image}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );
}

function AlbumsHorizontal(props) {
  const { data, heading, navigation, tagline } = props;
  return (
    <View style={styles.container}>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      {tagline && <Text style={styles.tagline}>{tagline}</Text>}

      <FlatList
        contentContainerStyle={styles.containerContent}
        data={data}
        horizontal
        keyExtractor={itemObj => itemObj.id.toString()}
        renderItem={itemObj => renderItem(navigation, itemObj)}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

AlbumsHorizontal.defaultProps = {
  heading: null,
  tagline: null
};

AlbumsHorizontal.propTypes = {
  // required
  data: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,

  // optional
  heading: PropTypes.string,
  tagline: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    width: '100%'
  },
  containerContent: {
    paddingLeft: 16
  },
  heading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    paddingBottom: 6,
    textAlign: 'center'
  },
  tagline: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    paddingBottom: 6,
    textAlign: 'center'
  },
  item: {
    marginRight: 16,
    width: 148
  },
  image: {
    backgroundColor: colors.greyLight,
    height: 148,
    width: 148
  },
  title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'center'
  }
});

export default AlbumsHorizontal;
