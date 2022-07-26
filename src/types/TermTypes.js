export default class TermTypes {
    static TermOfUseVendor = 'Termo de uso';
    static TermOfUseVendorStaff = 'Termo de uso';
    static TermOfUseReseller = 'Termo de uso';
    static TermOfUseClient = 'Termo de uso';
    static PrivacyPolicy = 'Politica de privacidade';

    static keys = Object.keys(TermTypes);
    static list = TermTypes.keys.map((termType) => {
        return {
            id: termType,
            name: TermTypes[termType]
        };
    });
}