const mongoose = require('mongoose');
const {
    MongoMemoryServer
} = require('mongodb-memory-server');
const mongoServer = new MongoMemoryServer();

const connect = () => {
    return new Promise((resolve, reject) => {
        mongoServer.getUri().then((mongoUri) => {
            const mongooseOpts = {
                autoReconnect: true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            };

            mongoose.connect(mongoUri, mongooseOpts);

            mongoose.connection.on('error', (e) => {
                if (e.message.code === 'ETIMEDOUT') {
                    console.log(e);
                    mongoose.connect(mongoUri, mongooseOpts);
                }
                console.log(e);
                reject(e);
            });

            mongoose.connection.once('open', () => {
                console.log(`MongoDB successfully connected to ${mongoUri}`);
                resolve();
            });
        });
    });
}

const close = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
}

module.exports = {
    connect,
    close
};