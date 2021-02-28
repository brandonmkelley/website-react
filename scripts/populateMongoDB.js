
// These ought to be sync'd from the start w/ Firebase Auth.
const usersToPopulate = [
    { email: 'brandonmkelley@outlook.com' },
    { email: '14bmkelley@gmail.com' },
    { email: 'katiemtaylor@cox.net' }
]

db.users.insert(usersToPopulate)

// Map users emails to populate to resulting user _ids.
const userIds = usersToPopulate.reduce((result, item) => {
    result.push(db.users.find({ email: { $eq: item.email } }).limit(1).next()._id)
    return result
}, [])


const subjectsToPopulate = [
    {
        "name": "This is thread 1",
        "createdDt": "2021-02-01T00:00:00.000Z",
        "createdUser": userIds[1]
    },
    {
        "name": "This is thread 2",
        "createdDt": "2021-02-05T00:00:00.000Z",
        "createdUser": userIds[2]
    }
]

db.subjects.insert(subjectsToPopulate)

const subjectIds = subjectsToPopulate.reduce((result, item) => {
    result.push(db.subjects.find({ name: { $eq: item.name } }).limit(1).next()._id)
    return result
}, [])


const messagesToPopulate = [
    {
        "subjectID": subjectIds[0],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[0],
        "recipientUserID": [userIds[2]],
        "informationalUserID": [userIds[1]],
        "sentDt": "2021-02-01T00:00:00.000Z"
    },
    {
        "subjectID": subjectIds[0],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [userIds[1]],
        "sentDt": "2021-02-02T00:00:00.000Z"
    },
    {
        "subjectID": subjectIds[0],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [],
        "sentDt": "2021-02-03T00:00:00.000Z"
    },
    {
        "subjectID": subjectIds[1],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [],
        "sentDt": "2021-02-04T00:00:00.000Z"
    },
    {
        "subjectID": subjectIds[0],
        "body": "This is what message 2 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [],
        "sentDt": "2021-02-05T00:00:00.000Z"
    },
    {
        "subjectID": subjectIds[1],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [],
        "sentDt": "2021-02-06T00:00:00.000Z"
    }
]

db.messages.insert(messagesToPopulate)
