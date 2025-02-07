import { PropsWithChildren } from 'react';
import { Text } from 'react-native';

import FadeIn from './FadeIn';
import Loading from './Loading';

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
    return <Loading />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return <FadeIn>{children}</FadeIn>;
}
