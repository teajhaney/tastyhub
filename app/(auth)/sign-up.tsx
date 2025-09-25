import { router } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function SignUp() {
  return (
    <View>
      <Text>SignUp</Text>
      <Button title="Sign in" onPress={() => router.push('/(auth)/sign-in')} />
    </View>
  );
}
