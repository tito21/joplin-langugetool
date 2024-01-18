
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
