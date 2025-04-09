import { Image, ImageContentFit } from 'expo-image';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import ContentUnavailable from './ContentUnavailable';
import Loading from './Loading';

import { useImage } from '~/api/places';

type RemoteImageProps = {
  path?: string | null;
  aspectRatio?: number;
  contentFit?: ImageContentFit;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

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

  return (
    <Image
      source={{ uri: image }}
      placeholder={{ blurhash }}
      {...imageProps}
      transition={500}
      recyclingKey={path}
      cachePolicy="memory-disk"
      contentFit={imageProps.contentFit ?? 'cover'}
    />
  );
}
