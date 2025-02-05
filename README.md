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
- [ ] add directions to details screen
- [ ] add map controls to details screen (change theme, pitch, toggle to user location)
- [ ] add transition animations
- [ ] add swipe to update/delete
