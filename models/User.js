import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9_-]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => ` ${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (v) {
    //     return /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[!@#$%^&*()+])[0-9a-zA-Z!@#$%^&()_+]{8,}$/.test(
    //       v
    //     );
    //   },
    //   message: (props) =>
    //     ` Password must contain at least 8 characters including one uppercase, one lowercase, one number, and one special character!`,
    // },
  },
  roles: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
  address: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9\s,'-]$/.test(v);
      },
      message: (props) => `${props.value} is not a valid address!`,
    },
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[+]\d{1,3}[-]\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
