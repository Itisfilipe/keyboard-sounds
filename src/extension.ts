'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import {spawn} from 'child_process';
// import * as events from 'events';

export function activate(context: vscode.ExtensionContext) {

    let basePath: string =  path.join(__dirname,'..', '..');
    let spaceAudio: string = path.join(basePath, 'audio', 'spacebar_press.mp3');
    let deleteAudio: string = path.join(basePath, 'audio', 'delete_press.mp3');
    let otherKeysAudio: string = path.join(basePath, 'audio', 'key_press.mp3');

    let player: AudioPlayer;

    console.log('Congratulations, your extension "keyboard-sounds" is now active!');

    let disposable = vscode.commands.registerCommand('xfilipe_keyboard_sounds.activate', () => {
        player = player || new AudioPlayer();
        let disposables: vscode.Disposable[] = [];

        vscode.workspace.onDidChangeTextDocument((e)=> {
            let pressedKey = e.contentChanges[0].text;
            if (pressedKey == ""){
                player.play(deleteAudio);
            } else if (pressedKey == " "){
                player.play(spaceAudio);
            }  else {
                player.play(otherKeysAudio);
            }
        }, this, disposables);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

/**
 * Audio player for keystroke sounds
 */
class AudioPlayer {
    private _process: any = undefined;
    private _stopped:boolean = true

    play(filePath: string){
        if(!this._stopped)
            this.stop()

        this._stopped = false;
        let args = ["-ao", "alsa", filePath];
        this._process = spawn('mplayer', args);
    }

    stop(){
        if (this._process) {
            this._process.kill('SIGTERM');
        }
        this._stopped = true;
    }
}