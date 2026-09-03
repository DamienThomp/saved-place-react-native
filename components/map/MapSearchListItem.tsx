import { SearchBoxSuggestion } from '@mapbox/search-js-core';
import { useTheme } from 'expo-router/react-navigation';
import { Pressable, Text, StyleSheet } from 'react-native';

import { tokens } from '~/constants/theme';
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
      accessibilityRole="button"
      accessibilityLabel="Select from search results"
      onPress={() => {
        onSelectSearchResult(item);
      }}
      style={[styles.listItem, { borderBlockColor: theme.colors.border }]}>
      <Text style={[styles.listItemInfo, { color: theme.colors.text }]}>{item.name}</Text>
      <Text style={{ color: theme.colors.text, opacity: tokens.opacity.textMuted }}>
        {item.place_formatted}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    padding: tokens.spacing.xxl,
    borderBottomWidth: 1,
  },
  listItemInfo: {
    ...tokens.typography.label,
    fontWeight: 'bold',
  },
});
