import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff4444',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 1,
          borderTopColor: '#333333',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Task Force',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.badge.shield.checkmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Blacklist',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.clipboard" color={color} />,
        }}
      />
    </Tabs>
  );
}
