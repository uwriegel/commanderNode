#!/usr/bin/python3
import sys
import gi
import mimetypes

gi.require_version('Gtk', '3.0')
from gi.repository import Gio
from gi.repository import Gtk

theme = Gtk.IconTheme.get_default()

def get_icon_path(extension, size=16):
    type_, _ = mimetypes.guess_type('x.' + extension)
    if type_:
        icon = Gio.content_type_get_icon(type_)
        
        info = theme.choose_icon(icon.get_names(), size, 0)
        if info:
            return info.get_filename()


while True:
    n = input()
    lines = n.split("\n")
    for line in lines: 
        print(get_icon_path(line.strip()), flush=True)





