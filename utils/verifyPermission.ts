import type { PermissionResponse } from 'expo-modules-core';
import { PermissionStatus } from 'expo-modules-core';
import { Alert } from 'react-native';

export default async function <T extends PermissionResponse>(
  info: T | null,
  message: string,
  fn: () => Promise<T>
): Promise<boolean> {
  if (info?.status === PermissionStatus.DENIED) {
    Alert.alert('Insufficient Permissions', message);
    return false;
  }

  if (info?.status === PermissionStatus.UNDETERMINED) {
    const result = await fn();

    return result.granted;
  }

  return true;
}
