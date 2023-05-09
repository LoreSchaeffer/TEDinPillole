const connect_to_db = require('./db');

// GET BY TALK HANDLER

const talk = require('./Talk');

module.exports.get_by_idx = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('Received event:', JSON.stringify(event, null, 2));
    let body = {}
    if (event.body) {
        body = JSON.parse(event.body)
    }
    // set default
    if(!body.idx) {
        callback(null, {
                    statusCode: 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the talk. Idx is null.'
        })
    }
    
    connect_to_db().then(() => {
        console.log('=> get talk');
        talk.find({_id: body.idx}).then(talks => {
                    watchNext(talk, talks[0].watch_next).then(watch_next => {
                        callback(null, {
                        statusCode: 200,
                        body: JSON.stringify(watch_next)
                    })
                    });
                }
            )
            .catch(err =>
                callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the talk.'
                })
            );
    });
};

async function watchNext(talk, ids) {
    return await talk.find({'_id': {$in: ids}});
}