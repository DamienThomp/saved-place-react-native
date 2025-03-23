import { ComponentProps, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import ContentUnavailable from './ContentUnavailable';
import Loading from './Loading';

import { dbClient } from '~/lib/db';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
  aspectRatio?: number;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState<string | null>();
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    if (!path) return;
    (async () => {
      setImage(null);
      setIsloading(true);
      const { data, error } = await dbClient.storage.from('place-images').download(path);

      if (error) {
        console.log(error);
        setIsloading(false);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setIsloading(false);
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

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

  if (!image) {
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
    <Animated.Image
      source={{ uri: image || fallback }}
      {...imageProps}
      entering={FadeIn.duration(500)}
    />
  );
};

export default RemoteImage;
