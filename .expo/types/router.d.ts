/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/FoodDetails` | `/(tabs)/dashboard` | `/(tabs)/donation` | `/(tabs)/myOrder` | `/(tabs)/myRequest` | `/(tabs)/profile` | `/(tabs)/restaurantListing` | `/FoodDetails` | `/OnBoardScreens/onBoardFour` | `/OnBoardScreens/onBoardOne` | `/OnBoardScreens/onBoardThree` | `/OnBoardScreens/onBoardTwo` | `/TrackOrder/TrackOrder` | `/_sitemap` | `/accessLocation/AccessLocation` | `/auth/sign-in` | `/auth/sign-up` | `/checkout/checkout` | `/context/RoleContext` | `/context/UserContext` | `/dashboard` | `/donation` | `/donor/donorForm` | `/myOrder` | `/myRequest` | `/orderReceipt/OrderReceipt` | `/orderReceipt/OrderSuccess` | `/profile` | `/profileDetails/personalInfo` | `/reciever/recieverDonation/FreeMealRequest` | `/reciever/recieverForm` | `/reciever/recieverImpact/RecieverImpact` | `/restaurantListing` | `/role_selection`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
