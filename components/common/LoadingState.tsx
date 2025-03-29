import { PropsWithChildren } from 'react';

import ContentUnavailable from './ContentUnavailable';
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
    return (
      <ContentUnavailable icon="warning" color="grey">
        {error.message}
      </ContentUnavailable>
    );
  }

  return <FadeIn>{children}</FadeIn>;
}
