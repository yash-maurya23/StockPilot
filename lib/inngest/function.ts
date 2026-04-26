
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

export const sendSignUpEmail = inngest.createFunction(
  {
    id: "sign-up-email",
  },

 
  async ({ event, step }: { event: UserCreatedEvent; step: any }) => {
    if (event.name !== "app/user.created") return;

  
    const userProfile = `
- Investment goals: ${event.data.investmentGoals}
- Risk tolerance: ${event.data.riskTolerance}
- Preferred industry: ${event.data.preferredIndustry}
`;

    
    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    // ✅ AI call
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

    // ✅ Extract AI response safely
    const part = response?.candidates?.[0]?.content?.parts?.[0];

    const introText =
      part && "text" in part
        ? part.text
        : "Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.";

    // ✅ Send email step
    await step.run("send-welcome-email", async () => {
      const { email, name } = event.data;

      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);