import { CustomButton, CustomInput } from '@/components';
import { getCurrentUser, signIn } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import * as sentry from '@sentry/react-native';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { setIsAuthenticated, setUser } = useAuthStore(state => state);

  const submit = async () => {
    const { email, password } = form;
    if (!email || !password)
      return Alert.alert(
        'Error',
        'Please enter a valid email address and password'
      );
    setIsSubmitting(true);
    try {
      //call appwrite Sign in function
      await signIn({ email, password });
      // immediately set auth state to prevent redirect loop in Tabs
      const authedUser = await getCurrentUser();
      if (authedUser) {
        setUser(authedUser as any);
        setIsAuthenticated(true);
      }
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={text => setForm(prev => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={text => setForm(prev => ({ ...prev, password: text }))}
        label="Password"
        secureTextEntry={true}
      />

      <CustomButton title="Sign in" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          {' '}
          Don&apos;t have an account?
        </Text>
        <Link href={'/sign-up'} className="base-bold text-primary">
          Sign up
        </Link>
      </View>
    </View>
  );
}
