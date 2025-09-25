import { router } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function SignIn() {
  return (
    <View>
      <Text>SignIn</Text>
      <Button title="Sign up" onPress={() => router.push('/(auth)/sign-up')} />
    </View>
  );
}
