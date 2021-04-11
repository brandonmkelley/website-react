
import { Query, Document } from 'mongoose'

export class EventQuery<D> {
    event: string;
    _eventQuery: () => Query<any[], Document<D>>;

    constructor(eventName: string, eventQuery: (() => Query<any[], Document<D>>)) {
        this.event = eventName
        this._eventQuery = eventQuery
    }

    async query(shouldRemap: boolean = false) {
        var result: any = await this._eventQuery()

        if (shouldRemap === true)
            result = this.mapListToDictionaryIDs(result)

        return result
    }

    mapListToDictionaryIDs(rows: any[]) : any {
        return rows.reduce((r, i) => {
            r[i.id] = i
            return r
        }, {})
    }
}
