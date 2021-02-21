
import * as mongoose from 'mongoose'

export interface ISubject extends mongoose.Document {
    name: { type: String },
    createdUser: { type: String, required: true }
}

const SubjectSchema = new mongoose.Schema<ISubject>({
    name: { type: String },
    createdUser: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<ISubject>('Subject', SubjectSchema);
