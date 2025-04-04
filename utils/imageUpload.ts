import * as FileSystem from 'expo-file-system';

import { dbClient } from '~/lib/db';
import uuid from '~/utils/UUID';
import decode from '~/utils/decode';

const uploadImage = async (image: string) => {
  if (!image?.startsWith('file://')) {
    throw new Error("Can't save image with invalid file path");
  }

  const base64 = await FileSystem.readAsStringAsync(image, {
    encoding: 'base64',
  });

  const filePath = `${uuid()}.png`;
  const contentType = 'image/png';
  const { data, error } = await dbClient.storage
    .from('place-images')
    .upload(filePath, decode(base64), { contentType });

  if (error) {
    throw new Error(`image upload error: ${JSON.stringify(error)}`);
  }

  return data?.path;
};

export default uploadImage;
