import { ComponentProps, useEffect, useState } from 'react';
import { Image, View } from 'react-native';

import ContentUnavailable from './ContentUnavailable';

import { dbClient } from '~/lib/db';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!path) return;
    (async () => {
      setImage('');
      const { data, error } = await dbClient.storage.from('place-images').download(path);

      if (error) {
        console.log(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
    return (
      <View style={{ flex: 1, height: imageProps.height, width: imageProps.width }}>
        <ContentUnavailable icon="image-outline">No Image</ContentUnavailable>
      </View>
    );
  }

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;
