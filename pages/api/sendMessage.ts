import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    const requestData = req.body.text;

    if (requestData) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: requestData,
      });

      res
        .status(200)
        .json({ success: true, message: "Message sent successfully!" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid request data." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export default sendMessage;
