//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import {AudioPlayer, EditorListener} from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Audio Player Tests", () => {
    let player: AudioPlayer;
    let basePath: string;
    let spaceAudio: string;
    setup(()=>{
        player= new AudioPlayer();
        basePath = path.join(__dirname,'..', '..');
        spaceAudio = path.join(basePath, 'audio', 'spacebar_press.mp3');
    })
    // its not working right now...
    test("should not throw an error while playing", () => {
        assert.doesNotThrow(()=>{
            player.play(spaceAudio);
        }, Error);
    });
});