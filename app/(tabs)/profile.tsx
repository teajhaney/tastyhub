import { CustomButton, CustomHeader } from '@/components';
import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';
import { ProfileCardProps } from '@/type';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileCard = ({ image, title, subTitile }: ProfileCardProps) => (
  <View className="flex flex-row items-center gap-5">
    <View className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
      <Image source={image} resizeMode="contain" className="size-8" />
    </View>
    <View className="flex flex-col">
      <Text className="text-gray-200">{title}</Text>
      <Text className="font-quicksand-semibold text-md">{subTitile}</Text>
    </View>
  </View>
);

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="bg-white h-full pb-28 px-5 pt-5">
      <ScrollView className="flex flex-col gap-5">
        <CustomHeader title="Profile" />
        <View className="flex-center">
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : {
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
                  }
            }
            resizeMode="contain"
            className="size-20 rounded-full flex-center"
          />
        </View>

        <View className="flex  items-start gap-10 p-5 my-10  w-full rounded-sm bg-white shadow-2xl shadow-black/5">
          <ProfileCard
            image={images.user}
            title="Full name"
            subTitile={user!.name}
          />
          <ProfileCard
            image={images.envelope}
            title="Email"
            subTitile={user!.email}
          />
          <ProfileCard
            image={images.phone}
            title="Phone number"
            subTitile={'+1 555 123 4567'}
          />
          <ProfileCard
            image={images.location}
            title="Address 1 - (Home)"
            subTitile={'123 Main Street, Springfield, IL 62704'}
          />
          <ProfileCard
            image={images.location}
            title="Address 2 - (Work)"
            subTitile={'221B Rose Street, Foodville, FL 12345'}
          />
        </View>

        <View className="flex gap-3">
          <CustomButton
            title=" Edit profile"
            style="bg-primary/10 border border-primary p-4"
            textStyle="!font-quicksand-bold !text-primary"
          />
          <CustomButton
            title=" Sign out"
            style="bg-[#F14141]/10 border border-[#F14141] p-4"
            textStyle="!font-quicksand-bold !text-[#F14141]"
            leftIcon={images.logout}
            iconStyle="size-10"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
