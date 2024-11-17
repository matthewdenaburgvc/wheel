# How to Create Icons

## Requirements

1. A line art image of the icon you want to use (PNG format)
2. [`imagemagick`](https://imagemagick.org/script/command-line-tools.php) tool

## Set up the Source Images

Let's say we're working on the edit icon.

1. Give your image a transparent background.
2. Create the light-mode `edit` icon by making the pencil all black using the "fill" tool.
3. Save the file.
4. Make a copy of the file.
5. In the copy, use the "fill" tool to make the pencil white.
6. Save again.
7. Make both images 32x32 pixels.

Make sure your light-mode version has a black icon, and the dark-mode version has a white icon.

## Create the Icon

Using `imagemagick`, combine the light and dark mode images into a `.ico` file as follows:

```sh
magick convert +append edit-dark.png edit-light.png edit.ico
```

Open your file. It is important to ensure that the dark-mode image is to the left of the light-mode one.
