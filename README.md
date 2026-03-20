# gnome-oled-mask
GNOME extension to minimize OLED burn-in by applying a rectangular shifting pixel mask.

Using a pixel mask with every second pixel turned off (black) ensures that all pixels inside the defined mask will be periodically turned off. Could also used as additional dimming feature if applied to the whole screen.

Fullscreen applications disabled the mask.

![Demo of pixel mask.](https://github.com/geludwig/gnome-oled-mask/blob/main/demo.gif)

## Tested on
- Gnome 49 (Linux 6.19.8-1-cachyos)

## Installation
```
git clone https://github.com/geludwig/gnome-oled-mask
```
```
cp -r gnome-oled-mask/oled-mask@gludwig/ ~/.local/share/gnome-shell/extensions/oled-mask@gludwig
```
```
glib-compile-schemas ~/.local/share/gnome-shell/extensions/oled-mask@gludwig/schemas/
```
```
gnome-extensions enable oled-mask@gludwig
```
```
gnome-extensions prefs oled-mask@gludwig
```
