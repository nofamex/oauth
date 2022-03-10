import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema({
  name: { type: String, required: true },
  clientSecret: { type: String, required: true },
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
