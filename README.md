# SimpleAR [CREATOR]

SimpleAR Creator is an Augmented Reality Authoring Tool using [Google Blockly](https://developers.google.com/blockly/). Through visual programming, you can create augmented reality apps.

![Screenshot of Simple AR](screenshot.png)

## Installing / Getting started

```shell
npm install
npm start
```

This will start a server on localhost:4200 and open the desktop app on development mode.

### Initial Configuration

Create a new Firebase app on the [Firebase console](https://console.firebase.google.com/) with your Google Account by clicking on ``Add project`` and typing a name for your app.

Then click on ``Add Firebase to your web app``, and copy the config info (available under Authentication tab, then click on Web Setup on the upper right corner) on the corresponding fields into [src/environments/environment.ts](src/environments/environment.ts), do the same to [src/environments/environment.prod.ts](src/environments/environment.prod.ts).

Go to Database > Rules, and enable anonymous access by copying the following on the text box:

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Licensing

The code in this project is licensed under [MIT License](LICENSE.md).