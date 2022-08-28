import { Types } from '@ikomida/components'
export default class AppStorePublishStatus extends Types.BaseType {

    constructor(type) {
        super(type)
        switch (type) {
            case AppStorePublishStatus.PENDING:
                this.name = 'esperando'
                this.description = 'esperando atuação'
                break
            case AppStorePublishStatus.DOING:
                this.name = 'em andamento'
                this.description = 'em andamento'
                break
            case AppStorePublishStatus.ATTENTION:
                this.name = 'precisando de atenção';
                this.description = 'precisando de atenção';
                break
            case AppStorePublishStatus.REJECTED:
                this.name = 'rejeitado';
                this.description = 'rejeitado';
                break
            case AppStorePublishStatus.CANCELED:
                this.name = 'cancelado'
                this.description = 'cancelado'
                break
            case AppStorePublishStatus.DONE:
                this.name = 'feito'
                this.description = 'feito'
                break
            default:
                this.name = '-'
                this.description = '-'
                break
        }
    }

    static PENDING = 'PENDING';
    static DOING = 'DOING';
    static ATTENTION = 'ATTENTION';
    static REJECTED = 'REJECTED';
    static CANCELED = 'CANCELED';
    static DONE = 'DONE';
}