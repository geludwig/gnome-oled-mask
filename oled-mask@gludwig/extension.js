import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Cairo from 'gi://cairo';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class OledMaskExtension extends Extension {
    enable() {
        this.shiftOffset = 0;
        
        this._settings = this.getSettings('org.gnome.shell.extensions.oled-mask');

        this.mask = new St.DrawingArea({
            name: 'oled-burnin-mask',
            reactive: false,
        });

        this._initPattern();

        this._repaintId = this.mask.connect('repaint', (area) => {
            const cr = area.get_context();
            cr.setOperator(Cairo.Operator.CLEAR);
            cr.paint();
            cr.setOperator(Cairo.Operator.OVER);

            cr.save();
            cr.translate(this.shiftOffset, 0);
            cr.setSource(this.pattern);
            cr.paint();
            cr.restore();

            // FIX: Explicitly dispose the Cairo context to prevent a massive memory leak
            cr.$dispose();
        });

        Main.uiGroup.add_child(this.mask);

        this._applySettings();
        this._settingsChangedId = this._settings.connect('changed', this._applySettings.bind(this));

        this._fullscreenId = global.display.connect('in-fullscreen-changed', this._updateVisibility.bind(this));
        
        this._updateVisibility();
    }

    _updateVisibility() {
        if (!this.mask) return;

        let isFullscreen = false;
        const numMonitors = global.display.get_n_monitors();
        
        for (let i = 0; i < numMonitors; i++) {
            if (global.display.get_monitor_in_fullscreen(i)) {
                isFullscreen = true;
                break;
            }
        }

        if (isFullscreen) {
            this.mask.hide();
        } else {
            this.mask.show();
        }
    }

    _applySettings() {
        const x = this._settings.get_int('mask-x');
        const y = this._settings.get_int('mask-y');
        const w = this._settings.get_int('mask-width');
        const h = this._settings.get_int('mask-height');
        this.shiftIntervalMs = this._settings.get_int('interval-ms');

        this.mask.set_position(x, y);
        this.mask.set_size(w, h);
        
        this._setupTimer();
        this.mask.queue_repaint();
    }

    _setupTimer() {
        if (this.timeoutId) {
            GLib.Source.remove(this.timeoutId);
            this.timeoutId = null;
        }

        this.timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, this.shiftIntervalMs, () => {
            // FIX: Prevent crashes if the timer fires right after the extension is disabled
            if (!this.mask) {
                this.timeoutId = null;
                return GLib.SOURCE_REMOVE;
            }

            this.shiftOffset = (this.shiftOffset === 0) ? 1 : 0;
            this.mask.queue_repaint(); 
            return GLib.SOURCE_CONTINUE;
        });
    }

    _initPattern() {
        const surface = new Cairo.ImageSurface(Cairo.Format.ARGB32, 2, 2);
        const cr = new Cairo.Context(surface);
        cr.setSourceRGBA(0, 0, 0, 1);
        cr.rectangle(0, 0, 1, 1);
        cr.rectangle(1, 1, 1, 1);
        cr.fill();
        
        this.pattern = new Cairo.SurfacePattern(surface);
        this.pattern.setExtend(Cairo.Extend.REPEAT);

        // FIX: Dispose temporary context
        cr.$dispose();
    }

    disable() {
        if (this.timeoutId) {
            GLib.Source.remove(this.timeoutId);
            this.timeoutId = null;
        }
        
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        
        if (this._fullscreenId) {
            global.display.disconnect(this._fullscreenId);
            this._fullscreenId = null;
        }

        if (this.mask) {
            if (this._repaintId) {
                this.mask.disconnect(this._repaintId);
                this._repaintId = null;
            }
            Main.uiGroup.remove_child(this.mask);
            this.mask.destroy();
            this.mask = null;
        }
        
        this._settings = null;
        this.pattern = null;
    }
}
