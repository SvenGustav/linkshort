import mongoose from 'mongoose';

const connect = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGODB_URI);
        
        // Try to connect with retries
        let retries = 3;
        while (retries > 0) {
            try {
                await mongoose.connect(process.env.MONGODB_URI || '');
                console.log('✅ Database connected successfully');
                return;
            } catch (err) {
                retries--;
                if (retries === 0) throw err;
                console.log(`Connection failed, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            }
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error('\nTroubleshooting steps:');
        console.error('1. Make sure MongoDB is installed');
        console.error('2. Start MongoDB using: "C:\\Program Files\\MongoDB\\Server\\[version]\\bin\\mongod.exe" --dbpath="C:\\data\\db"');
        console.error('3. Check if MongoDB is running on port 27017');
        console.error('4. Make sure your .env file has the correct MONGODB_URI');
        process.exit(1);
    }
};

export default connect;