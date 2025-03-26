import { ComponentProps } from 'react';
import { Image, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import ContentUnavailable from './ContentUnavailable';
import Loading from './Loading';

import { useImage } from '~/api/places';

type RemoteImageProps = {
  path?: string | null;
  aspectRatio?: number;
} & Omit<ComponentProps<typeof Image>, 'source'>;

export default function RemoteImage({ path, ...imageProps }: RemoteImageProps) {
  const { data: image, isLoading, error } = useImage(path);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          height: imageProps.height,
          width: imageProps.width,
          aspectRatio: imageProps.aspectRatio,
        }}>
        <Loading />
      </View>
    );
  }

  if (!image || error) {
    return (
      <Animated.View
        style={{
          flex: 1,
          height: imageProps.height,
          width: imageProps.width,
          aspectRatio: imageProps.aspectRatio,
        }}
        exiting={FadeOut}>
        <ContentUnavailable icon="image-outline" color="white">
          No Image
        </ContentUnavailable>
      </Animated.View>
    );
  }

  return <Animated.Image source={{ uri: image }} {...imageProps} entering={FadeIn.duration(500)} />;
}
