import { SearchBoxSuggestion } from '@mapbox/search-js-core';
import { useTheme } from '@react-navigation/native';
import { Pressable, Text, StyleSheet } from 'react-native';

import { useMapSearch } from '~/providers/MapSearchProvider';

type MapSearchListItemProps = {
  item: SearchBoxSuggestion;
  onSelected: () => void;
};

export default function MapSearchListItem({ item, onSelected }: MapSearchListItemProps) {
  const { setSelectedResult } = useMapSearch();
  const theme = useTheme();

  const onSelectSearchResult = (item: SearchBoxSuggestion) => {
    setSelectedResult?.(item);
    onSelected();
  };

  return (
    <Pressable
      onPress={() => {
        onSelectSearchResult(item);
      }}
      style={[styles.listItem, { borderBlockColor: theme.colors.border }]}>
      <Text style={[styles.listItemInfo, { color: theme.colors.text }]}>{item.name}</Text>
      <Text style={{ color: theme.colors.text, opacity: 0.8 }}>{item.place_formatted}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    padding: 22,
    borderBottomWidth: 1,
  },
  listItemInfo: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
