import { usePlacesList } from '~/api/places';
import { Container } from '~/components/common/Container';
import LoadingState from '~/components/common/LoadingState';
import PlacesList from '~/components/place/PlacesList';

export default function MainView() {
  const { data, error, isLoading } = usePlacesList();

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <Container>
        <PlacesList items={data} />
      </Container>
    </LoadingState>
  );
}
