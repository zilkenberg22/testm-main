import bcrypt from "bcrypt";
import dbConnect from "../../server/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const { userName, email, password } = req.body;
    const data = { userName, email, password };

    const user = await User.findOne({ email: email });
    if (user)
      return res
        .status(400)
        .json({ error: true, message: "И-Майл хаяг бүртгэгдсэн байна" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    await new User({ ...data, password: hashPassword }).save();

    res.status(201).json({ error: false, message: "Бүртгэл амжилттай" });
  } catch (err) {
    res.status(500).json({ error: true, message: "Алдаа гарлаа :( " });
  }
}
