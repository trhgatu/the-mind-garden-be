import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Kết nối thành công");
    } catch(error) {
        console.log("Kết nối thất bại");
    }
};

export { mongoose, connectDatabase }