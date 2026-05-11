import { dbClient } from '~/lib/db';
import uuid from '~/utils/UUID';
import decode from '~/utils/Decode';
import fileToBase64 from '~/utils/fileToBase64';

const uploadImage = async (image: string) => {
  const base64 = await fileToBase64(image);

  const filePath = `${uuid()}.png`;
  const contentType = 'image/png';

  const { data, error } = await dbClient.storage
    .from('place-images')
    .upload(filePath, decode(base64), { contentType });

  if (error) {
    throw new Error(`image upload error: ${JSON.stringify(error)}`);
  }

  if (!data?.path) {
    throw new Error('image upload returned no path');
  }

  return data.path;
};

export default uploadImage;
