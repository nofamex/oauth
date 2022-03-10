import mongoose from "mongoose";

export const initDB = () => {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
  const DBURL = `${DB_HOST}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

  mongoose
    .connect(DBURL)
    .then(() => console.log("successfully connect to database"));
};
