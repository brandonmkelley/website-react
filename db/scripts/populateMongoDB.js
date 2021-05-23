
// These ought to be sync'd from the start w/ Firebase Auth.
const usersToPopulate = [
    {
        email: 'brandonmkelley@outlook.com',
        firstName: 'Brandon',
        lastName: 'Kelley',
        updatedBy: 'brandonmkelley@outlook.com',
        updatedAt: Date.now,
        createdBy: 'brandonmkelley@outlook.com',
        createdAt: Date.now
    },
    {
        email: '14bmkelley@gmail.com',
        firstName: 'Brandon',
        lastName: 'Kelley (Other)',
        updatedBy: 'brandonmkelley@outlook.com',
        updatedAt: Date.now,
        createdBy: 'brandonmkelley@outlook.com',
        createdAt: Date.now
    },
    {
        email: 'katiemtaylor@cox.net',
        firstName: 'Katie',
        lastName: 'Taylor',
        updatedBy: 'brandonmkelley@outlook.com',
        updatedAt: Date.now,
        createdBy: 'brandonmkelley@outlook.com',
        createdAt: Date.now
    }
]

db.users.insert(usersToPopulate)

// Map users emails to populate to resulting user _ids.
const userIds = usersToPopulate.reduce((result, item) => {
    result.push(db.users.find({ email: { $eq: item.email } }).limit(1).next()._id)
    return result
}, [])


const subjectsToPopulate = [
    {
        name: "This is thread 1",
        updatedBy: userIds[1],
        updatedAt: Date.now,
        createdBy: userIds[1],
        createdAt: Date.now
    },
    {
        name: "This is thread 2",
        updatedBy: userIds[2],
        updatedAt: Date.now,
        createdBy: userIds[2],
        createdAt: Date.now
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
        "sentDt": "2021-02-01T00:00:00.000Z",
        updatedBy: userIds[0],
        updatedAt: Date.now,
        createdBy: userIds[0],
        createdAt: Date.now
    },
    {
        "subjectID": subjectIds[0],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [userIds[1]],
        "sentDt": "2021-02-02T00:00:00.000Z",
        updatedBy: userIds[2],
        updatedAt: Date.now,
        createdBy: userIds[2],
        createdAt: Date.now
    },
    {
        "subjectID": subjectIds[0],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [],
        "sentDt": "2021-02-03T00:00:00.000Z",
        updatedBy: userIds[2],
        updatedAt: Date.now,
        createdBy: userIds[2],
        createdAt: Date.now
    },
    {
        "subjectID": subjectIds[1],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[1],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [],
        "sentDt": "2021-02-04T00:00:00.000Z",
        updatedBy: userIds[1],
        updatedAt: Date.now,
        createdBy: userIds[1],
        createdAt: Date.now
    },
    {
        "subjectID": subjectIds[0],
        "body": "This is what message 2 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[0]],
        "informationalUserID": [],
        "sentDt": "2021-02-05T00:00:00.000Z",
        updatedBy: userIds[2],
        updatedAt: Date.now,
        createdBy: userIds[2],
        createdAt: Date.now
    },
    {
        "subjectID": subjectIds[1],
        "body": "This is what message 1 has to say, it is typically longer content.",
        "fromUserID": userIds[2],
        "recipientUserID": [userIds[1]],
        "informationalUserID": [],
        "sentDt": "2021-02-06T00:00:00.000Z",
        updatedBy: userIds[2],
        updatedAt: Date.now,
        createdBy: userIds[2],
        createdAt: Date.now
    }
]

db.messages.insert(messagesToPopulate)


const contentToPopulate = [
    {
        topic: 'Engineering',
        name: 'Computer Architecture',
        updatedBy: userIds[0],
        updatedAt: Date.now,
        createdBy: userIds[0],
        createdAt: Date.now
    },
    {
        topic: 'Engineering',
        name: 'Human-Computer Interaction',
        updatedBy: userIds[0],
        updatedAt: Date.now,
        createdBy: userIds[0],
        createdAt: Date.now
    }
]

db.contents.insert(contentToPopulate)
