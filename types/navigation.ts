export type RootStackParamList = {
  MainTabs: undefined;
  Camera: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Camera: undefined;
  Map: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 