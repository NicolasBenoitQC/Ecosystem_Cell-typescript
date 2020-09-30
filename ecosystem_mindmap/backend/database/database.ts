import  Mongoose from 'mongoose';
import { CellModel } from './cells/cells.model';

let database: Mongoose.Connection;

// fonction to connect the database.
export const Connect = async (databaseName:string) => {
    
    // set uri to connect to mongoDB
    let uri:string;
    if(databaseName === 'CellsMindMap') {
        uri =
    'mongodb+srv://Nicolas:Nicolas@cluster0-rcppa.mongodb.net/CellsMindMap?retryWrites=true&w=majority';
    } else if (databaseName === 'UnitTestCellsMindMap') {
        uri = 
    'mongodb+srv://Nicolas:Nicolas@cluster0-rcppa.mongodb.net/UnitTestCellsMindMap?retryWrites=true&w=majority';
    
    }
         
    
    // if always connect to the database, do nothing.
    if (database) {
        return;
    }

    // connect to the MongoDB.
    await Mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    // connect to the database.
    database = Mongoose.connection;

    // return message to inform the connection with database has established.
    database.once('open', async () => {
        console.log('Connected to database');
    });

    // return message to inform the connection could not establish.
    database.on('error', () => {
        console.log('Error connecting to database');
    });
    
    console.log(uri)
    
    return {
        CellModel
    }
};

// fonction to disconnect the database.
export const disconnect = async () => {

    // if database is not connect do nothing.
    if (!database) {
        return;
    };
    await Mongoose.disconnect();

}

