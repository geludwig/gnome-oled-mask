# gnome-oled-mask
GNOME extension to minimize OLED burn-in by applying a shifting pixel mask.

The extension turns off every second pixel by overwriting it with a black pixel. The mask shifts by one pixel defined by a timer, additionally size and location of the rectengular mask can also be customized. Fullscreen applications disabled the mask.

![Demo of pixel mask.](https://github.com/geludwig/gnome-oled-mask/blob/main/demo1.gif)

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
