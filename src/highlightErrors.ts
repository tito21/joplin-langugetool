
export default function (_context) {
    return {
        // A plugin needs to either include a plugin here OR have enable an addon
        plugin: async function (CodeMirror) {
            CodeMirror.defineExtension('highlightMistakes', function (mistakes) {
                console.log("From CM");
                console.log(mistakes);
                const doc = this.getDoc();
                console.log(doc);
                // doc.markText({ line: 1, ch: 0 },
                //     { line: 1, ch: 0 + 10 },
                //     { className: "mistake" });
                for (let idx=0; idx < mistakes.length; idx++) {
                    console.log(mistakes[idx]);
                    doc.markText({ line: mistakes[idx].line, ch: mistakes[idx].offset },
                        { line: mistakes[idx].line, ch: mistakes[idx].offset + mistakes[idx].length },
                        { className: mistakes[idx].type });
                }
            });

            CodeMirror.defineExtension('getItemsUnderCursor', function() {
                const coord = this.getCursor('head');
                return coord;
            });

            CodeMirror.defineExtension('replaceSuggestion', function(value, corr, length, word) {
                const doc = this.getDoc();
                doc.replaceRange(value, corr, { line: corr.line, ch: corr.ch + length}, word);
            });



        },
        // Some resources are included   with codemirror and extend the functionality in standard ways
        // via plugins (called addons) which you can find here: https://codemirror.net/doc/manual.html#addons
        // and are available under the addon/ directory
        // or by adding keymaps under the keymap/ directory
        // or additional modes available under the mode/ directory
        // All are available in the  CodeMirror source: https://github.com/codemirror/codemirror
        codeMirrorResources: ['addon/search/match-highlighter'],
        // Often addons for codemirror need to be enabled using an option,
        // There is also certain codemirror functionality that can be enabled/disabled using
        // simple options
        codeMirrorOptions: { 'highlightSelectionMatches': true },
        // More complex plugins (and some addons) will require additional css styling
        // which is available through the assets function. As seen below, this styling can
        // either point to a css file in the plugin src directory or be included inline.
        assets: function () {
            return [
                { name: './mistakeHighligh.css' }
                // { inline: true,
                // text: '.cm-matchhighlight {	background-color: lightgreen;}',
                // mime: 'text/css',
                // }
            ];
        },
    }
}
