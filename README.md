# Too Wide!

Sites such as, um, Wikipedia insist on using the full width of the screen.
For many of us, this means it renders the page much too wide to be comfortably readable.

This add-on adds a contextual (right-click) menu which allows you to toggle the width of the current page.

By default, the new width will be 960px. You can adjust this in the preferences.

Although designed to work with Wikipedia and its cousins, it will also work with many other pages
designed a long long time ago, before wide screens became fashionable.

[Get Too Wide! on the Firefox Addons Marketplace](https://addons.mozilla.org/firefox/addon/too-wide/)

## Usage
You can use the extension to toggle the page width via the context menu or the action button.

## Development
To install and automatically refresh the Addon in a new Firefox instance, you can use the development environment with [node](https://nodejs.org/).

You can install the dependencies with `npm install`.
Then, to test the Addon you should run the command `npm run watch-firefox` in the working directory of the project. This opens a new Firefox instance with the Addon installed. Furthermore, the `about:debug` page and the Wikipedia main page will be opened for convenient testing and debugging.

## E & EO

This Addon does what it does, and doesn’t do what it doesn’t do. Share & Enjoy.
