import * as mongoose from "mongoose";

interface TInput {
    db: string;
}
export default ({db}: TInput) => {

    const connect = () => {
        mongoose
            .connect(
                db,
                { useNewUrlParser: false },
            )
            .then(() => {
                return console.info(`Successfully connected to ${db}`);
            })
            .catch((error) => {
                console.error("Error connecting to database: ", error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on("disconnected", connect);
};
