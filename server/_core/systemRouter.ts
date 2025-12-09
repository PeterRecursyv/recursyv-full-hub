import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  submitContactForm: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        message: z.string().min(10, "Message must be at least 10 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const { sendEmail } = await import('../email-service');
      const timestamp = new Date().toISOString();
      
      const success = await sendEmail({
        subject: `New Contact Form Submission from ${input.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Name:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${input.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${input.email}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Timestamp:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${timestamp}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${input.message}</td>
              </tr>
            </table>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This is an automated notification from Recursyv Full Hub Contact Form.
            </p>
          </div>
        `,
      });
      
      return {
        success,
      } as const;
    }),
});
