
import { Query, Document, Model } from 'mongoose'
import { isConstructorDeclaration } from 'typescript';

export class EventQuery<D extends Document> {
    event: string;
    baseModel: Model<D>;
    pipeline: (appContext?: any) => any[];
    sensitivityList: Model<any>[];

    constructor(
        eventName: string,
        eventModel: Model<D>,
        eventPipeline: ((appContext?: any) => any[]) = (() => [{ $limit: 10000 }]),
        eventSensitivityList: Model<any>[] = []) {

        this.event = eventName
        this.baseModel = eventModel
        this.pipeline = eventPipeline
        this.sensitivityList = eventSensitivityList
    }

    async exec(appContext?: any, watchContext?: any) {
        return this.aggregate(appContext, watchContext).exec()
            .then(result => new Promise((res, rej) =>
                res(result ? this.mapListToDictionaryIDs(result) : undefined)))
    }

    aggregate(appContext?: any, watchContext?: any) {
        const all = this.baseModel.aggregate(this.pipeline(appContext))

        return (watchContext && watchContext.hasOwnProperty(this.event))
            ? all.match({ '_id': { $eq: watchContext[this.event]._id } })
            : all
    }

    mapListToDictionaryIDs(rows: any[]) : any {
        return rows.reduce((r, i) => {
            r[i['_id']] = i
            return r
        }, {})
    }
}

/*
export class EventQuery<D> {
    event: string;
    _eventQuery: () => Query<any[], Document<D>>;
    _baseModel: Model<Document<D>>;
    _pipeline: (any) => any[];

    constructor(eventName: string, eventQuery: (() => Query<any[], Document<D>>)) {
        this.event = eventName
        this._eventQuery = eventQuery
    }

    async query() {
        var result: any = await this._eventQuery()
        return this.mapListToDictionaryIDs(result)
    }

    async exec(appContext: any, callback: any) {
        this._baseModel.aggregate(this._pipeline(appContext)).exec(callback)
    }

    aggregate(appContext: any) {
        return this._baseModel.aggregate(this._pipeline(appContext))
    }

    watchAggregate(appContext: any, watchContext: any) {
        const all = this.aggregate(appContext)

        return (watchContext.hasOwnProperty(this.event))
            ? all.match({ '_id': { $in: watchContext[this.event] } })
            : all
    }

    mapListToDictionaryIDs(rows: any[]) : any {
        return rows.reduce((r, i) => {
            r[i.id] = i
            return r
        }, {})
    }
}
*/

