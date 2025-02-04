import { PropsWithChildren } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

type LoadingStateProps = {
  isLoading: boolean;
  error: Error | null;
};

export default function LoadingState({
  children,
  isLoading,
  error,
}: PropsWithChildren<LoadingStateProps>) {
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return <>{children}</>;
}
