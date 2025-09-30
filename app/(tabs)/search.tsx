import { CartButton, Filter, MenuCard, SearchBar } from '@/components';
import { getCategories, getMenu } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { Category, MenuItem } from '@/type';
import cn from 'clsx';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Search() {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();
  const { data: menu } = useAppwrite({
    fn: getMenu,
    params: {
      category,
      query,
    },
  });
  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  // Remove the useEffect that was causing infinite requests
  // The useAppwrite hook will automatically fetch when params change
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={menu}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View
              className={cn(
                'flex-1 max-w-[48%]',
                !isFirstRightColItem ? 'mt-10' : 'mt-0'
              )}
            >
              <MenuCard item={item as MenuItem} />
            </View>
          );
        }}
        keyExtractor={item => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Search
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    Find your favourite food
                  </Text>
                </View>
              </View>
              <CartButton />
            </View>
            <Text>
              <SearchBar />
            </Text>
            <Text>
              <Filter categories={categories! as Category[]} />
            </Text>
          </View>
        )}
        ListEmptyComponent={() => <Text>No results</Text>}
      />
    </SafeAreaView>
  );
}
