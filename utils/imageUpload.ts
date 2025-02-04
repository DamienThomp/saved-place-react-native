import * as FileSystem from 'expo-file-system';

import { dbClient } from '~/lib/db';
import decode from '~/utils/Decode';
import uuid from '~/utils/UUID';

const uploadImage = async (image: string) => {
  if (!image?.startsWith('file://')) {
    return null;
  }

  const base64 = await FileSystem.readAsStringAsync(image, {
    encoding: 'base64',
  });

  const filePath = `${uuid()}.png`;
  const contentType = 'image/png';
  const { data } = await dbClient.storage
    .from('place-images')
    .upload(filePath, decode(base64), { contentType });

  if (data) {
    return data.path;
  }

  return null;
};

export default uploadImage;
