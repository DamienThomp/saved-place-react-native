import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

import useEditModeStore from '~/stores/editModeStore';

export function useEditModeNavigation() {
  const navigation = useNavigation();
  const { setEditMode } = useEditModeStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setEditMode(false);
    });

    return unsubscribe;
  }, [navigation, setEditMode]);
}
