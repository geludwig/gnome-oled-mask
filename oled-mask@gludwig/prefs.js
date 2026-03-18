import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class OledMaskPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Retrieve the settings object using the built-in method
        const settings = this.getSettings();

        // Create a standard Adwaita preferences page and group
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({ title: 'Mask Coordinates & Timing' });
        page.add(group);

        // Helper function to create a UI row for number inputs
        const createSpinRow = (title, key, min, max, step) => {
            const row = new Adw.ActionRow({ title: title });
            
            const spinButton = new Gtk.SpinButton({
                adjustment: new Gtk.Adjustment({ lower: min, upper: max, step_increment: step }),
                valign: Gtk.Align.CENTER,
                halign: Gtk.Align.END
            });

            // Bind the UI button directly to the GSettings key
            settings.bind(key, spinButton, 'value', Gio.SettingsBindFlags.DEFAULT);

            row.add_suffix(spinButton);
            row.activatable_widget = spinButton;
            return row;
        };

        // Add the rows to the group
        group.add(createSpinRow('X Position', 'mask-x', 0, 10000, 1));
        group.add(createSpinRow('Y Position', 'mask-y', 0, 10000, 1));
        group.add(createSpinRow('Width (Pixels)', 'mask-width', 1, 10000, 10));
        group.add(createSpinRow('Height (Pixels)', 'mask-height', 1, 10000, 1));
        group.add(createSpinRow('Shift Interval (ms)', 'interval-ms', 100, 3600000, 1000));

        window.add(page);
    }
}
