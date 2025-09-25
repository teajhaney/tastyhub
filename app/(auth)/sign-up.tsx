import { CustomButton, CustomInput } from '@/components';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });

  const submit = async () => {
    if (!form.fullName || !form.email || !form.password)
      Alert.alert('Error', 'Please enter a valid email address and password');
    setIsSubmitting(true);
    try {
      //call appwrite Sign in function
      Alert.alert('Success', 'You have successfully signed in');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your full name"
        value={form.fullName}
        onChangeText={text => setForm(prev => ({ ...prev, fullName: text }))}
        label="Full Name"
      />
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
          Already have an account?
        </Text>
        <Link href={'/sign-in'} className="base-bold text-primary">
          Sign in
        </Link>
      </View>
    </View>
  );
}
