
import { Document, Model, Aggregate } from 'mongoose'

export class QueryPipelineBuilder<D extends Document> {
    queryBaseModel: Model<D>;
    queryPipelineFactory: ((appContext?: any, watchContext?: any) => any[]);
    queryPipelineSensitivityList: Model<any>[];

    constructor(
        queryBaseModel: Model<D>,
        queryPipelineFactory: ((appContext?: any, watchContext?: any) => any[]),
        queryPipelineSensitivityList: Model<any>[] = []) {
        
        this.queryBaseModel = queryBaseModel
        this.queryPipelineFactory = queryPipelineFactory
        this.queryPipelineSensitivityList = queryPipelineSensitivityList
    }

    aggregate(appContext?: any, watchContext?: any): Aggregate<any[]> {
        return this.queryBaseModel.aggregate(this.queryPipelineFactory(appContext, watchContext))
    }
}

export class EventToQueryResponseBinding<D extends Document> {
    event: string;
    model: Model<D>;
    responseQueryShouldBeWatched: boolean;
    responseQueryPipelineBuilder: QueryPipelineBuilder<D>;
    bindingAction: ((appContext?: any, watchContext?: any) => Promise<void>) | undefined

    constructor(
        event: string,
        model: Model<D>,
        responseQueryShouldBeWatched: boolean = false,
        responseQueryPipelineBuilder: QueryPipelineBuilder<D> | undefined = undefined,
        bindingAction: ((appContext?: any, watchContext?: any) => Promise<void>) | undefined
            = undefined) {

        this.event = event
        this.model = model
        this.responseQueryShouldBeWatched = responseQueryShouldBeWatched

        if (responseQueryPipelineBuilder)
            this.responseQueryPipelineBuilder = responseQueryPipelineBuilder
        else
            this.responseQueryPipelineBuilder = new QueryPipelineBuilder<D>(
                model, () => [{ $limit: 100 }], [])

        this.bindingAction = bindingAction
    }

    async exec(appContext?: any, watchContext?: any) {
        let aggregatePipeline = this.responseQueryPipelineBuilder.aggregate(appContext, watchContext)

        if (watchContext && watchContext.hasOwnProperty(this.event)) {
            aggregatePipeline = aggregatePipeline
                .match({ '_id': { $eq: watchContext[this.event]._id } })
        }

        if (this.bindingAction)
            await this.bindingAction(appContext, watchContext)

        return await aggregatePipeline
            .exec()
            .then(result => new Promise((res, rej) =>
                res(result ? this.mapListToDictionaryIDs(result) : undefined)))
    }

    mapListToDictionaryIDs(rows: any[]) : any {
        return rows.reduce((r, i) => {
            r[i['_id']] = i
            return r
        }, {})
    }
}
