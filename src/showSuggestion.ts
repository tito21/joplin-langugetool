
export default function (_context) {
    return {
        // A plugin needs to either include a plugin here OR have enable an addon
        plugin: async function (CodeMirror) {
            CodeMirror.defineExtension('showSuggestion', function (suggestions) {
                console.log("From CM 2");
                const node = document.createElement("div");
                node.style.width = "10em";
                node.style.background = "green";
                node.style.zIndex = "1000";
                let list = "<ul class=suggestionList>"
                for (let sug of suggestions) {
                    list += `<li><a onClick="joplin.commands.execute('showSuggestion', ${sug});">${sug}</a></li>`
                }
                list += "</ul>"
                node.innerHTML = list;
                console.log(node);
                this.addWidget({ line: 2, ch: 0 }, node, false);
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
