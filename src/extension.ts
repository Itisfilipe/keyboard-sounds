'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';
let memoizee = require('memoizee');


export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "keyboard-sounds" is now active!');

    let disposable = vscode.commands.registerCommand('xfilipe_keyboard_sounds.activate', () => {
        // The code you place here will be executed every time your command is executed
        let player = new AudioPlayer();
        // player.playEnter();
        player.playOtherKeys();
        player.playOtherKeys();
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

/**
 * Javascript keycodes, more here http://keycode.info/
 */
enum keyCodes {BACKSPACE=8, ENTER=13, SPACE=32, DELETE=46}

/**
 * Audio player for keystroke sounds
 */
class AudioPlayer {
    private _basePath: string =  path.join(__dirname,'..', '..');
    private _spaceAudio: string = path.join(this._basePath, 'audio', 'spacebar_press.mp3');
    private _deleteAudio: string = path.join(this._basePath, 'audio', 'delete_press.mp3');
    private _otherKeysAudio: string = path.join(this._basePath, 'audio', 'key_press.mp3');
    // uses memoizee to cache the exec function
    // not sure if get fastter with this, TODO: test it
    private _execCached = memoizee(child_process.exec, {primitive: true});

    _play(soundFile){
        // TODO: remember to do that using binaries packed with this plugin for portability!
        this._execCached(`mplayer -really-quiet -nolirc -ao alsa ${soundFile}`, error => {
            if (error) {
                vscode.window.showErrorMessage("You should have \"mplayer\" installed on your PATH,"+
                                               " see the documentation for more information.")
                return;
            }
        });
    }

    playEnter(): void{
        this._play(this._deleteAudio)
    }

    playSpace(): void{
        this._play(this._spaceAudio);
    }

    playOtherKeys(): void{
        this._play(this._otherKeysAudio);
    }
}

// class EditorListener {
//     constructor(public player: AudioPlayer){

//     }
// }