/* eslint-disable react-native/no-inline-styles */
import React, {memo, useEffect, useRef,useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import FastImage from 'react-native-fast-image';
// import DummyImage from "../assets/images/dummy.png"
const ImageUrl = '../../';
const MyImage = ({
  uri,
  width,
  height,
  minHeight,
  minWidth,
  style,
  children,
  resizeMode = FastImage.resizeMode.cover,
  log,
}) => {
  const [image, setImage] = useState({width, height});
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  // const [v, setV] = useStateIfMounted(new Date().getTime())
  const viewRef = useRef(null);
  viewRef.current = {x: 0, y: 0, width: 0, height: 0};

  const _ratio = (width, height) => {
    const ratio = viewRef.current.width / width;
    const newWidth = viewRef.current.width;
    const newHeight = height * ratio;
    //if (log) console.log('ratio', ratio, newWidth, newHeight)
    setImage(prev => ({...prev, width: newWidth, height: newHeight}));
  };
  useEffect(() => {
    fetch(uri, {method: 'HEAD'})
      .then(res => {
        if (res.ok) {
          setExists(true);
        } else {
          setExists(false);
        }
      })
      .catch(err => console.log('Error:', err));
  }, [uri]);

  return (
    <View
      style={{width: '100%', minHeight: minHeight}}
      onLayout={event => {
        var {x, y, width, height} = event.nativeEvent.layout;
        viewRef.current = {x, y, width, height};
      }}>
      {uri && (
        <FastImage
          style={{
            width: '100%',
            height: image.height,
            ...style,
            backgroundColor: '#fff',
          }}
          source={{
            uri: `${uri}`,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.cacheOnly,
            cache: FastImage.cacheControl.immutable,
          }}
          //fallback
          onLoad={e => _ratio(e.nativeEvent.width, e.nativeEvent.height)}
          resizeMode={resizeMode}
          onLoadEnd={() => setLoading(false)}>
          {children}
          {loading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color={'#3575d3'} />
            </View>
          )}
        </FastImage>
      )}
    </View>
  );
};
export default memo(MyImage);
