import uploadImage from './imageUpload';

export default async function prepareImagePath(imagePath: string): Promise<string> {
  if (imagePath.startsWith('file://')) {
    return await uploadImage(imagePath);
  }
  return imagePath;
}
