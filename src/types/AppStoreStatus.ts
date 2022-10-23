import { Types } from '@ikomida/shared-frontend'
export default class AppStoreStatus extends Types.Types.TBaseType {
  public name: string
  public description: string

  constructor(type: string) {
    super(type)
    switch (type) {
      case AppStoreStatus.PENDING:
        this.name = 'esperando'
        this.description = 'esperando atuação'
        break
      case AppStoreStatus.DOING:
        this.name = 'em andamento'
        this.description = 'em andamento'
        break
      case AppStoreStatus.ATTENTION:
        this.name = 'precisando de atenção'
        this.description = 'precisando de atenção'
        break
      case AppStoreStatus.REJECTED:
        this.name = 'rejeitado'
        this.description = 'rejeitado'
        break
      case AppStoreStatus.CANCELED:
        this.name = 'cancelado'
        this.description = 'cancelado'
        break
      case AppStoreStatus.DONE:
        this.name = 'feito'
        this.description = 'feito'
        break
      default:
        this.name = '-'
        this.description = '-'
        break
    }
  }

  static PENDING = 'PENDING'
  static DOING = 'DOING'
  static ATTENTION = 'ATTENTION'
  static REJECTED = 'REJECTED'
  static CANCELED = 'CANCELED'
  static DONE = 'DONE'
}
