import { Container } from '~/components/common/Container';
import PlacesList from '~/components/place/PlacesList';
import Place from '~/model/Place';

export default function MainView() {
  const items: Place[] = [];

  return (
    <Container>
      <PlacesList items={items} />
    </Container>
  );
}
