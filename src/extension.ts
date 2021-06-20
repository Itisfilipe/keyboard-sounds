'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import {spawn} from 'child_process';

let player: AudioPlayer;
let listener: EditorListener;
let extensionPos: number;
let isActive: boolean;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "keyboard-sounds" is now active!');


    // to avoid multiple different instances
    player = player || new AudioPlayer();
    listener = listener || new EditorListener(player);

    // is the extension activated? yes by default.
    isActive = context.globalState.get("xfilipe_keyboard_sounds", true)

    vscode.commands.registerCommand('xfilipe_keyboard_sounds.activate', () => {
        if (!isActive) {
            context.globalState.update("xfilipe_keyboard_sounds", true);
            isActive = true;
            vscode.window.showInformationMessage("Extension actived.");
        } else {
            vscode.window.showWarningMessage("Extension already active.");
        }
    });
    vscode.commands.registerCommand('xfilipe_keyboard_sounds.deactivate', () => {
        if (isActive) {
            context.globalState.update("xfilipe_keyboard_sounds", false);
            isActive = false;
            vscode.window.showInformationMessage("Extension deactived.");
        } else {
            vscode.window.showWarningMessage("Extension already deactivated.");
        }
    });

    // @ts-ignore - for some reason it insists subscriptions is an object and not an array
    context.subscriptions.push(listener);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

/**
 * Listen to editor changes and play a sound when a key is pressed.
 */
export class EditorListener {
    private _disposable: vscode.Disposable;
    private _subscriptions: vscode.Disposable[] = [];
    private _basePath: string = path.join(__dirname, '..', '..');
    private _spaceAudio: string = path.join(this._basePath, 'audio', 'spacebar_press.mp3');
    private _deleteAudio: string = path.join(this._basePath, 'audio', 'delete_press.mp3');
    private _enterAudio: string = path.join(this._basePath, 'audio', 'enter_press.wav');
    private _otherKeysAudio: string = path.join(this._basePath, 'audio', 'key_press.mp3');

    constructor(private player: AudioPlayer) {
        vscode.workspace.onDidChangeTextDocument(this._keystrokeCallback, this, this._subscriptions);
        this._disposable = vscode.Disposable.from(...this._subscriptions);
    }

    _keystrokeCallback(e : vscode.TextDocumentChangeEvent) {
        if (!isActive) {
            return;
        }
        let enteredText = e.contentChanges[0].text;
        if (enteredText == "") {
            // backspace or delete pressed
            this.player.play(this._deleteAudio);
        } else if (enteredText == " ") {
            // space pressed
            this.player.play(this._spaceAudio);
        } else if (enteredText == "\n" || enteredText.length > 2) {
            // enter pressed (length > 2 is a proxy for enter - it happens when autocomplete is used)
            // we use >2 instead of >1 so this this won't trigger when user enters { and it autocompletes to {}
            this.player.play(this._enterAudio);
        } else {
            // any other keys
            this.player.play(this._otherKeysAudio);
        }
    }

    dispose() {
        this._disposable.dispose();
    }
};

/**
 * Audio player for keystroke sounds
 */
export class AudioPlayer {
    private _process: any = undefined;
    private _stopped: boolean = true;

    play(filePath: string) {
        // stop mplayer before play again to avoid delays
        if (!this._stopped) {
            this.stop()
        }

        this._stopped = false;
        let args = ["-ao", "alsa", "-volume", "100", filePath];

        // spawn let us communicate with our child process
        // TODO: spawn every time a key is pressed not seems good,
        // maybe change this create just one child for the object
        // and use it to play the file multiple times.
        this._process = spawn('mplayer', args);

        // see if an error occours
        this._process.on('error', function (err) {
            if (err.code == "ENOENT") {
                // error no entry (file/directory)
                vscode.window.showErrorMessage("Keyboard Sounds: Apparently you do not have 'mplayer' installed on your $PATH, see README for more information")
            } else {
                vscode.window.showErrorMessage("Keyboard Sounds: Something went wrong!!!")
            }
        });
    }

    stop() {
        if (this._process) {
            this._process.kill('SIGTERM');
        }
        this._stopped = true;
    }
}
