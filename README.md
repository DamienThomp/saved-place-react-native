# Saved Place

Saved Place is a React Native demo application that allows users to save and view places with associated titles, addresses, photos, and locations on a map. 
Users can see these places in a list, view details about them, and interact with them through an interactive map interface powered by [MapBox](https://www.mapbox.com/).
The main purpose of this demo project was to experiment with MapBox and Supabase integration in a React Native application. 

## Features

- **Save Places:** Users can save places by providing a title, location, and photo.
- **List View:** View saved places in a list format with basic information.
- **Details View:** View detailed information for a selected place with:
  - A map view showing the location pin drop.
  - An overlay card displaying the photo, title, and address of the place.
- **Map Integration:** Uses [MapBox](https://www.mapbox.com/) for rendering maps and placing location pins.
- **Database Integration:** Uses [Supabase](https://supabase.io/) for storing and retrieving saved places data.

## Technologies Used

- **React Native:** Framework for building cross-platform mobile applications.
- **MapBox:** Provides interactive maps and geolocation functionality.
- **Supabase:** Open-source Firebase alternative for managing databases and authentication.
- **Expo:** This app uses Expo and Expo-Router.

## Future Improvements
- [x] ~~add directions to details screen~~
- [x] ~~add transition animations~~
- [x] ~~add swipe to delete~~
- [x] ~~add search to mapview for selecting a place. (currently defaults to user location)~~
- [ ] improve search, refactor provider and map components
- [ ] add map controls to details screen (change theme, pitch, toggle to user location)
- [ ] add profile screen with user info and sign out button

## Screen Shots

### Place List
<img width="180" src="https://github.com/user-attachments/assets/a8271973-8d09-4e0c-a847-0ff268fe406f">
<img width="180" src="https://github.com/user-attachments/assets/ddce1844-0dfd-4b2c-bcf2-3c33d7014cc2">

## Place Form
<img width="200" src="https://github.com/user-attachments/assets/1c671c23-872d-41ff-990f-c290dda93aa9">
<img width="200" src="https://github.com/user-attachments/assets/19c7718a-e43f-43e8-9fd5-d36bfaa41434">
<img width="200" src="https://github.com/user-attachments/assets/c2b513dd-b912-41c0-9f5a-16acbb3a9064">

## Details
<img width="200" src="https://github.com/user-attachments/assets/b7806e99-0c02-4ad3-b25a-07e74d66e020">
<img width="200" src="https://github.com/user-attachments/assets/c5a3186f-8083-46a2-9dff-e125d8e291cb">

