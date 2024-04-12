#!/usr/bin/env bash
# ----------------------------------------------------------
# Removes XFA form data from a PDF file.
# ----------------------------------------------------------

pdftk "$1" output "$1_fixed" drop_xfa
mv "$1_fixed" "$1"
