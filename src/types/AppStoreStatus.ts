import { Types } from '@ikomida/shared-frontend'
export default class AppStoreStatus extends Types.Types.TBaseType {
  constructor(type: string) {
    super(type)
    switch (type) {
      case 'PENDING':
        this.name = 'esperando'
        this.description = 'esperando atuação'
        break
      case 'DOING':
        this.name = 'em andamento'
        this.description = 'em andamento'
        break
      case 'ATTENTION':
        this.name = 'precisando de atenção'
        this.description = 'precisando de atenção'
        break
      case 'REJECTED':
        this.name = 'rejeitado'
        this.description = 'rejeitado'
        break
      case 'CANCELED':
        this.name = 'cancelado'
        this.description = 'cancelado'
        break
      case 'DONE':
        this.name = 'feito'
        this.description = 'feito'
        break
      default:
        this.name = '-'
        this.description = '-'
        break
    }
  }

  static PENDING = new AppStoreStatus('PENDING')
  static DOING = new AppStoreStatus('DOING')
  static IN_REVIEW = new AppStoreStatus('IN_REVIEW')
  static ATTENTION = new AppStoreStatus('ATTENTION')
  static REJECTED = new AppStoreStatus('REJECTED')
  static CANCELED = new AppStoreStatus('CANCELED')
  static DONE = new AppStoreStatus('DONE')
}
