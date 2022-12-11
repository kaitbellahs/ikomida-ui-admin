import { Types } from '@ikomida/shared-frontend'
export default class AppStorePublishStatus extends Types.Types.TBaseType {
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

  static PENDING = new AppStorePublishStatus('PENDING')
  static DOING = new AppStorePublishStatus('DOING')
  static ATTENTION = new AppStorePublishStatus('ATTENTION')
  static REJECTED = new AppStorePublishStatus('REJECTED')
  static CANCELED = new AppStorePublishStatus('CANCELED')
  static DONE = new AppStorePublishStatus('DONE')
}
