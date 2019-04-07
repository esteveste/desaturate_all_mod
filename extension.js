// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

let button;
let extension_icon;
let color_effect;

function _toggleEffect() {
    if (Main.uiGroup.has_effects(color_effect)) {
        Main.uiGroup.remove_effect(color_effect);
    } else {
        Main.uiGroup.add_effect(color_effect);
    }
}

function _timeEnable() {
    if (!Main.uiGroup.has_effects(color_effect)) {
        Main.uiGroup.add_effect(color_effect);
    }
}

function init() {
    //Creation of button
    button = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        track_hover: true
    });
    extension_icon = new St.Icon({
        icon_name: 'applications-graphics-symbolic',
        style_class: 'system-status-icon'
    });
    button.set_child(extension_icon);

    //Creation of effect
    color_effect = new Clutter.DesaturateEffect();

    //Signal connection
    button.connect('button-press-event', _toggleEffect);

    //Set to activate on time
    var now = new Date();
    var millisTill = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0, 0) - now;
    if (millisTill < 0) {
        millisTill += 86400000; // it's after the hour, try again tomorrow.
    }
    Mainloop.timeout_add_seconds(millisTill, _timeEnable);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
