'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import {spawn} from 'child_process';
// import * as events from 'events';

export function activate(context: vscode.ExtensionContext) {

    let player: AudioPlayer;
    let listener: editorListener;

    console.log('Congratulations, your extension "keyboard-sounds" is now active!');

    player = player || new AudioPlayer();
    listener = listener || new editorListener(player);

    context.subscriptions.push(listener);
}

// this method is called when your extension is deactivated
export function deactivate() {
}


class editorListener {
        private _disposable: vscode.Disposable;
        private _subscriptions: vscode.Disposable[] = [];
        private _basePath: string =  path.join(__dirname,'..', '..');
        private _spaceAudio: string = path.join(this._basePath, 'audio', 'spacebar_press.mp3');
        private _deleteAudio: string = path.join(this._basePath, 'audio', 'delete_press.mp3');
        private _otherKeysAudio: string = path.join(this._basePath, 'audio', 'key_press.mp3');

        constructor(private player: AudioPlayer){
            // vscode.window.onDidChangeTextEditorSelection(this._keystrokeCallback, this, this._subscriptions);
            // vscode.window.onDidChangeActiveTextEditor(this._keystrokeCallback, this, this._subscriptions);
            vscode.workspace.onDidChangeTextDocument(this._keystrokeCallback, this, this._subscriptions);
            this._disposable = vscode.Disposable.from(...this._subscriptions);
         }

        _keystrokeCallback(e){
            let pressedKey = e.contentChanges[0].text;
            if (pressedKey == ""){
                this.player.play(this._deleteAudio);
            } else if (pressedKey == " "){
                this.player.play(this._spaceAudio);
            }  else {
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