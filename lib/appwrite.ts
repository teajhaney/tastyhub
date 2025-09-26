import { CreateUserParams, SignInParams } from '@/type';
import {
  Account,
  Avatars,
  Client,
  ID,
  Query,
  TablesDB,
} from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: 'com.seobinim.tastyhub',
  databaseId: '68d54cc0002d429615fb',
  userCollectionId: 'user',
};

export const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create({
      userId: ID.unique(),
      email: email,
      password: password,
      name: name,
    });

    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);
    const newUser = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userCollectionId,
      rowId: ID.unique(),
      data: {
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        avatar: avatarUrl,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    // Check if we have a valid session first
    let currentAccount;

    currentAccount = await account.get();

    if (!currentAccount || !currentAccount.$id) {
      console.log('No current account found');
      return null;
    }

    //getting current user info with unique id
    const currentUser = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userCollectionId,
      queries: [Query.equal('accountId', currentAccount.$id)],
    });

    if (!currentUser) throw Error;

    if (currentUser.rows.length > 0) {
      return currentUser.rows[0];
    }
  } catch (error) {
    console.log('getCurrentUser error:', error);
    return null;
  }
};
