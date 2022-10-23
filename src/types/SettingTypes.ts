import { Types } from '@ikomida/shared-frontend'

export default class SettingTypes extends Types.Types.TBaseType {
  static TEXT = new SettingTypes('Text')
  static BOOL = new SettingTypes('Boolean')
  static NUMBER = new SettingTypes('Number')
  static CURRENCY = new SettingTypes('Currency')
  static LIST = new SettingTypes('List')
}
