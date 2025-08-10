////////////////////////////////////////////////////
// Designer     : Sufyan
// Date         : 2025-8-2
// Description  : This is a sign-up controller functionality created with Inngest
////////////////////////////////////////////////////

import { inngest } from "../client";
import User from "../models/user.js"; // mongoose schema
import { sendMail } from "../../utils/mailer.js";
import { NonRetriableError } from "inngest";

export default inngest.createFunction({ id: "on-user-signup" }, { event: "user/signup" },
    async({ event, step }) => {
        try {
            const { email } = event.data;

            // Note: Pipelines can run independently, and can be died independently
            // Pipeline 1: Retrieve user from DB
            // user = {name, email, password}
            const user = await step.run("get-user-email", async() => {
                const userObj = await User.findOne({ email });
                if(!userObj) {
                    throw new NonRetriableError("User no longer exists");
                }
                return userObj;
            });

            // Pipeline 2: Send personalized welcome email to user (extracted from the DB)
            await step.run("send-welcome-email", async() => {
                await sendMail({
                    to: user.email,
                    subject: "Welcome to Our Sufyan's Agentic AI System!",
                    text: `Hi ${user.name},\n\nWe're glad to have you on board!\n\nBest regards,\nTeam`,
                });
            });
            return { message: "success" };
        } catch(error) {
            console.error("Signup Function Error:", error);
            throw error;
        }
    }
);