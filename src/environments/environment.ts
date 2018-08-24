// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBZ4HzmKZOLP5XOS1-msqnkU4DBdWpgL8A',
    authDomain: 'simplear-e9683.firebaseapp.com',
    databaseURL: 'https://simplear-e9683.firebaseio.com',
    projectId: 'simplear-e9683',
    storageBucket: 'simplear-e9683.appspot.com',
    messagingSenderId: '678146306977'
  },
  poly: {
    apiKey: 'AIzaSyBZ4HzmKZOLP5XOS1-msqnkU4DBdWpgL8A'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
