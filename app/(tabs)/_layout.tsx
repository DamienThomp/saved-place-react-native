import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function RoutLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(main)"
        options={{
          title: 'Main',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons color={color} size={size} name="list" />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons color={color} size={size} name="person" />,
        }}
      />
    </Tabs>
  );
}
