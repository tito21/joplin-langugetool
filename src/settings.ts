import joplin from 'api';
import { SettingItemType } from 'api/types';

export async function get_settings() {

    return {
        language: await joplin.settings.value('languagetoolLanguage'),
        url: await joplin.settings.value('languagetoolUrl'),
        dictionary: await joplin.settings.value('languagetoolDict'),
        API: await joplin.settings.value('languagetoolAPIKey'),
        username: await joplin.settings.value('languagetoolUsername'),
    };
}

export async function register_settings() {

    await joplin.settings.registerSection('settings.languagetool', {
        label: 'LanguageTool',
        iconName: "fas fa-language"
    });

    await joplin.settings.registerSettings({

        'languagetoolUrl': {
            value: "https://api.languagetool.org/v2/check",
            type: SettingItemType.String,
            section: 'settings.languagetool',
            public: true,
            label: 'URL for the LanguageTool instance (default for the public API). For Premium use https://api.languagetoolplus.com/v2/check'
        },

        'languagetoolLanguage': {
            value: "auto",
            type: SettingItemType.String,
            section: 'settings.languagetool',
            public: true,
            label: 'Default language to correct (use auto to automatically select the language). You can add regional variants'
        },

        'languagetoolAPIKey' : {
            value: "",
            type: SettingItemType.String,
            section: 'settings.languagetool',
            public: true,
            label: 'Premium API key'
        },

        'languagetoolUsername' : {
            value: "",
            type: SettingItemType.String,
            section: 'settings.languagetool',
            public: true,
            label: 'Premium username'
        },

        'languagetoolDict': {
            value: "",
            type: SettingItemType.String,
            section: 'settings.languagetool',
            public: true,
            label: 'Personal dictionary, words should be comma separated (Not used by the moment)'
        }
    });
}
