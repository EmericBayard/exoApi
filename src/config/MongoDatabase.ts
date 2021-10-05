import mongoose from 'mongoose';
import config from 'config';
import log from '../api/v1/helpers/logger';

async function connect() {
    const dbUrl = config.get("dbUrl") as string;
    
    try {
        log.info("Database 🍀 connected")
        return await mongoose.connect(dbUrl);
    }
    catch(e) {
        log.error("Database 🍁 error")
        process.exit(1)
    }      
}

export default connect;