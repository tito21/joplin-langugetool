import joplin from 'api';
import { SettingItemType } from 'api/types';

export async function get_settings() {

    return {
        language: await joplin.settings.value('languagetoolLanguage'),
        url: await joplin.settings.value('languagetoolUrl')
    };

}

export async function register_settings() {

    await joplin.settings.registerSection('settings.languagetool', {
        label: 'LanguageTool',
        iconName: "fas fa-language"
    });

    await joplin.settings.registerSettings({
        'languagetoolUrl': {
            value: "https://languagetool.org/api/v2/check",
            type: SettingItemType.String,
            section: 'settings.languagetool',
            public: true,
            label: 'URL for the LanguageTool instance (default for the public API)'
        },
        'languagetoolLanguage': {
            value: "auto",
            type: SettingItemType.String,
            section: 'settings.languagetool',
            public: true,
            label: 'Default language to correct (use auto to automatically select the language). You can add regional variants'
        }
    });
}
