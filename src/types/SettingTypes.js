export default class SettingTypes {
    static TEXT = 'Text';
    static BOOL = 'Boolean';
    static NUMBER = 'Number';
    static CURRENCY = 'Currency';
    static LIST = 'List';

    static keys = Object.keys(SettingTypes);
    static list = SettingTypes.keys.map((settingType) => {
        return {
            id: settingType,
            name: SettingTypes[settingType]
        };
    });
}