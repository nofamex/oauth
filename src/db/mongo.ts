import mongoose from "mongoose";

export const initDB = () => {
  const DBURL = `mongodb+srv://nofame:ra43f4ieDbqCGBO5@cluster0.rymax.mongodb.net/oauth?retryWrites=true&w=majority`;

  mongoose
    .connect(DBURL)
    .then(() => console.log("successfully connect to database"));
};
