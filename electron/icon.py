#!/usr/bin/python3
import sys
import gi
import mimetypes

gi.require_version('Gtk', '3.0')
from gi.repository import Gio
from gi.repository import Gtk

def get_icon_path(extension, size=16):
    type_, _ = mimetypes.guess_type('x.' + extension)
    if type_:
        icon = Gio.content_type_get_icon(type_)
        theme = Gtk.IconTheme.get_default()
        info = theme.choose_icon(icon.get_names(), size, 0)
        if info:
            return info.get_filename()

print(get_icon_path(sys.argv[1]))