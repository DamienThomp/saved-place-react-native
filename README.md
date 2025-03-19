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
- [ ] add map controls to details screen (change theme, pitch, ~~toggle to user location~~)
- [x] ~~add profile screen with user info and sign out button~~

## Screen Shots

### Place List
<img width="180" src="https://github.com/user-attachments/assets/c47ef763-fccb-438a-a7b4-8c0e6e605102">
<img width="180" src="https://github.com/user-attachments/assets/fa3aa320-3040-489e-a6f8-f0bd30b6bb01">

### Place Form
<img width="200" src="https://github.com/user-attachments/assets/1c671c23-872d-41ff-990f-c290dda93aa9">
<img width="200" src="https://github.com/user-attachments/assets/19c7718a-e43f-43e8-9fd5-d36bfaa41434">
<img width="200" src="https://github.com/user-attachments/assets/c2b513dd-b912-41c0-9f5a-16acbb3a9064">

### Details
<img width="200" src="https://github.com/user-attachments/assets/a52776cc-06e7-4d02-9af3-1e7c8e1c503d">

