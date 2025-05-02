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
- [x] ~~improve async image loader (refactor and add cache)~~
- [x] ~~add profile screen with user info and sign out button~~
- [x] ~~add update action to places list for editing a place~~
- [x] ~~add map controls to details screen (change theme, ~~pitch~~, ~~toggle to user location~~)~~
- [x] ~~add camera support for image picker~~
- [ ] Fix session refresh on Android
- [ ] improve search, refactor provider and map components
- [ ] add pagination for list view


## Screen Shots

### Place List
<img width="180" src="https://github.com/user-attachments/assets/6939b2c4-e9f8-4f6a-ba77-9df841625c23">
<img width="180" src="https://github.com/user-attachments/assets/3f6f9266-ec5e-48ba-a38b-7c892b571827">
<img width="180" src="https://github.com/user-attachments/assets/e965c27a-d8be-45d2-a0db-effb8c16285d">
<img width="180" src="https://github.com/user-attachments/assets/e485d4f9-b684-4186-9610-f3a0fa7d8386">

### Place Form
<img width="200" src="https://github.com/user-attachments/assets/1c671c23-872d-41ff-990f-c290dda93aa9">
<img width="200" src="https://github.com/user-attachments/assets/19c7718a-e43f-43e8-9fd5-d36bfaa41434">
<img width="200" src="https://github.com/user-attachments/assets/c2b513dd-b912-41c0-9f5a-16acbb3a9064">

### Details
<img width="200" src="https://github.com/user-attachments/assets/f7b15d93-dd4b-4798-8852-095074f94a26">
<img width="200" src="https://github.com/user-attachments/assets/64477499-282c-4871-aaad-2a9ac54da6e5">
<img width="200" src="https://github.com/user-attachments/assets/88122658-9aa3-48d3-a02c-009a2e013e01">

