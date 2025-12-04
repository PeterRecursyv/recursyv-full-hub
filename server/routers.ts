import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Configuration endpoints
  config: router({
    // Get all available hub vendors for selection
    allHubVendors: publicProcedure.query(async () => {
      const { loadAllHubVendors } = await import('./config-loader');
      return loadAllHubVendors();
    }),
    // Get specific hub vendor by ID
    hubVendor: publicProcedure
      .input((val: unknown) => val as { id?: string })
      .query(async ({ input }) => {
        const { loadHubVendor, getCurrentHubVendorId } = await import('./config-loader');
        const hubVendorId = input?.id || getCurrentHubVendorId();
        return loadHubVendor(hubVendorId);
      }),
    // Get spoke integrations for a specific hub
    spokeIntegrationsForHub: publicProcedure
      .input((val: unknown) => val as { hubId: string })
      .query(async ({ input }) => {
        const { loadHubVendor, getHubSpokeIntegrations } = await import('./config-loader');
        const hubVendor = loadHubVendor(input.hubId);
        const integrations = getHubSpokeIntegrations(hubVendor);
        return integrations.map(i => ({
          id: i.id,
          name: i.name,
          logo: i.logo,
          description: i.description,
          categories: i.categories,
          available: i.available
        }));
      }),
    branding: publicProcedure.query(async () => {
      const { loadBranding } = await import('./config-loader');
      return loadBranding();
    }),
    pricing: publicProcedure.query(async () => {
      const { loadPricing } = await import('./config-loader');
      return loadPricing();
    }),
  }),

  // Purchase flow endpoints
  purchase: router({
    create: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input }) => {
        const { createPurchase } = await import('./db');
        const { randomUUID } = await import('crypto');
        
        const purchaseId = randomUUID();
        const purchase = await createPurchase({
          id: purchaseId,
          ...input,
          templateId: 'multi-hub',
        });
        
        return { success: true, purchaseId: purchase?.id };
      }),
    
    update: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input }) => {
        const { updatePurchase } = await import('./db');
        const { id, ...updates } = input;
        await updatePurchase(id, updates);
        return { success: true };
      }),
    
    get: publicProcedure
      .input((val: unknown) => val as { id: string })
      .query(async ({ input }) => {
        const { getPurchase } = await import('./db');
        return await getPurchase(input.id);
      }),
  }),

  // Stripe payment endpoints (placeholder - configure with webdev_add_feature)
  stripe: router({
    createCheckoutSession: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input }) => {
        // Placeholder - Stripe not yet configured
        // To enable payments, run: webdev_add_feature with feature="stripe"
        throw new Error('Stripe payment processing not yet configured. Please contact us at peter.newman@recursyv.com to complete your purchase.');
      }),
  }),

  // Notification endpoints
  notification: router({
    sendPurchaseNotification: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input }) => {
        const { notifyOwner } = await import('./_core/notification');
        
        const success = await notifyOwner({
          title: `Purchase Step ${input.step} Completed`,
          content: JSON.stringify(input.data, null, 2),
        });
        
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
