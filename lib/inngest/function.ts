import { inngest } from "@/lib/inngest/client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompt";
import { sendWelcomeEmail } from "@/lib/nodemailer";

type UserCreatedEvent = {
  name: "app/user.created";
  data: {
    email: string;
    name: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
  };
};

type UserLoggedInEvent = {
  name: "app/user.logged_in";
  data: {
    email: string;
    name: string;
  };
};

export const sendSignUpEmail = inngest.createFunction(
  {
    id: "sign-up-email",
    triggers: { event: "app/user.created" },
  },
  async ({ event, step }: { event: UserCreatedEvent; step: any }) => {
    const userProfile = `
- Investment goals: ${event.data.investmentGoals}
- Risk tolerance: ${event.data.riskTolerance}
- Preferred industry: ${event.data.preferredIndustry}
`;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    const fallbackIntro =
      "Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.";
    let introText = fallbackIntro;

    // Keep signup email delivery resilient: if AI fails, send email with fallback intro.
    try {
      const response = await step.ai.infer("generate-welcome-intro", {
        model: step.ai.models.gemini({
          model: "gemini-2.5-flash-lite",
        }),
        body: {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        },
      });

      const part = response?.candidates?.[0]?.content?.parts?.[0];
      if (part && "text" in part && part.text?.trim()) {
        introText = part.text;
      }
    } catch (error) {
      console.error("AI intro generation failed, using fallback intro:", error);
    }

    // ✅ Send email step
    await step.run("send-welcome-email", async () => {
      const { email, name } = event.data;
      await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
      console.log("Sign-up email sent:", email);
      return { sent: true };
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);

export const sendSignInEmail = inngest.createFunction(
  {
    id: "sign-in-email",
    triggers: { event: "app/user.logged_in" },
  },
  async ({ event, step }: { event: UserLoggedInEvent; step: any }) => {
    await step.run("send-sign-in-email", async () => {
      const { email, name } = event.data;
      await sendWelcomeEmail({
        email,
        name,
        intro:
          "Welcome back to Signalist. Your stock market dashboard is ready whenever you are.",
      });
      console.log("Sign-in email sent:", email);
      return { sent: true };
    });

    return {
      success: true,
      message: "Sign-in email sent successfully",
    };
  }
);