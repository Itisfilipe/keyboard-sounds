# Keyboard Sounds Visual Studio Code Extension

An simple extension to play mechanical keyboard sounds while you type.

Tested on Linux for now. Feel free to send me pull request to made it available on other platforms or add new features.

**REPO: https://github.com/xfilipe/keyboard-sounds**

## Features

This extension is active by default when installed, if `mplayer` was not found it will show an error message.

Three different sounds will be played while you type, one for *space*, one for *delete/backspace* and one for all other keys.

## Requirements

You must have `mplayer` installed and configured on your PATH.

**Ubuntu**
```bash
sudo apt-get install mplayer
```

**Fedora**
```bash
sudo dnf install mplayer
```

## Known Issues

 * Was tested only on Linux.
 * Don't play when you hold a key.
 * Need to write tests.

## Release Notes


### 1.0.0

Initial release

### 1.0.1

Removed a bug on package.json


## LICENSE

The MIT License

Copyright (c) 2016 Filipe Teixeira Amaral

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.