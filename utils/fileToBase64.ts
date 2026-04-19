import * as FileSystem from 'expo-file-system/legacy';

const fileToBase64 = async (filePath: string): Promise<string> => {
  if (!filePath?.startsWith('file://')) {
    throw new Error(`Invalid file path: ${filePath}`);
  }

  return FileSystem.readAsStringAsync(filePath, {
    encoding: FileSystem.EncodingType.Base64,
  });
};

export default fileToBase64;
