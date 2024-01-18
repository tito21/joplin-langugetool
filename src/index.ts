
import joplin from 'api';
import { ContentScriptType } from 'api/types';


import { get_suggestions } from './languagetool';

joplin.plugins.register({
    onStart: async function () {

        console.log("Starting");

        async function updateErrors() {
            // eslint-disable-next-line no-console
            console.info('Hello world. Test plugin started!');

            const note = await joplin.workspace.selectedNote();

            // Keep in mind that it can be `null` if nothing is currently selected!
            if (note) {
                console.info('Note content has changed! New note is:', note);
            } else {
                console.info('No note is selected');
            }
            const mistakes = await joplin.commands.execute('getMistakes', note);
            console.log("The mistakes");
            console.log(mistakes);
            joplin.commands.execute('editor.execCommand', {
                name: 'highlightMistakes', // CodeMirror and TinyMCE
                args: [mistakes]
            });

            // joplin.commands.execute('editor.execCommand', {
            //     name: 'showSuggestion', // CodeMirror and TinyMCE
            //     args: [['value', 'value2']]
            // });

        }

        // This event will be triggered when the user selects a different note
        await joplin.workspace.onNoteSelectionChange(() => {
            updateErrors();
        });

        // This event will be triggered when the content of the note changes
        // as you also want to update the TOC in this case.
        await joplin.workspace.onNoteChange(() => {
            updateErrors();
        });

        await joplin.workspace.onResourceChange(() => {
            updateErrors();
        });

        await joplin.workspace.filterEditorContextMenu(async (object: any) => {
            const { line, ch } = await joplin.commands.execute('editor.execCommand', {
                name: 'getItemsUnderCursor',
            });
            console.log("getItems", line, ch);
            const note = await joplin.workspace.selectedNote();
            const mistakes = await joplin.commands.execute('getMistakes', note);
            const mistake = mistakes.filter((el) => el['line'] == line && (ch > el['offset'] && ch < el['offset'] + el['length']));
            console.log("mistake", mistake);

            if (mistake.length) {
                const items = []
                items.push({ type: 'separator' });

                for (let s of mistake[0].suggestions) {
                    items.push({
                        label: s.value,
                        commandName: 'replaceError',
                        commandArgs: [s.value, {line, ch: mistake[0].offset}, mistake[0].word.length, mistake[0].word]
                    });
                }
                console.log(items);
                object.items = object.items.concat(items);
            }
            return object;
        });

        await joplin.commands.register({
            name: 'getMistakes',
            label: 'get mistakes',
            execute: async (note) => {
                const data = await get_suggestions(note.body);
                // console.log(data);
                let newBody = note.body;
                const lines = newBody.split('\n');
                const len_lines = []
                let previous = 0
                for (let i in lines) {
                    len_lines.push(previous + lines[i].length + 1);
                    previous += lines[i].length + 1;
                }
                const mistakes = [];
                console.log(note);
                console.log(lines);
                let current_line = 0;
                console.log(len_lines);
                const matches = data.matches.sort((a, b) => a.offset < b.offset ? -1 : 1);
                console.log(matches);
                for (let error of matches) {
                    while (len_lines[current_line] < error.offset + 1) {
                        current_line++;
                    }
                    console.log(current_line);
                    let mistake = newBody.slice(error.offset, error.offset + error.length);
                    // newBody = newBody.slice(0, error.offset)
                    //     + newBody.slice(error.offset, error.offset + error.length).replace(mistake, `**${mistake}**`)
                    //     + newBody.slice(error.offset + error.length)
                    const type = error.type.typeName === "UnknownWord" ? 'mistake' : 'suggestion';
                    mistakes.push({
                        word: mistake, offset: error.offset - len_lines[current_line - 1], length: error.length, line: current_line, type: type, suggestions: error.replacements
                    });
                    // console.log(error);
                    // console.log(mistake);
                }
                // console.log(newBody);
                console.log("returning mistakes");
                console.log(mistakes);
                return mistakes
                // await updateNoteContent(note.id, newBody);
            }
        });

        /* To display the suggestions use the joplin.workspace.filterEditorContextMenu
        event. See https://github.com/CalebJohn/joplin-rich-markdown/blob/main/src/index.ts#L67C9-L67C49
        for an example
        */

        await joplin.commands.register({
            name: 'replaceError',
            label: 'Replace with a LanguageTool suggestion',
            execute: (value, corr, length, word) => {
                return joplin.commands.execute('editor.execCommand', {
                    name: 'replaceSuggestion', // CodeMirror and TinyMCE
                    args: [value, corr, length, word]
                });
            }
        });

        console.log("register script")
        await joplin.contentScripts.register(
            ContentScriptType.CodeMirrorPlugin,
            'highlightErrors',
            './highlightErrors.js'
        );


        updateErrors();
    }

});
