CREATE INDEX `hubVendorIdx` ON `purchases` (`hubVendorId`);--> statement-breakpoint
CREATE INDEX `spokeIntegrationIdx` ON `purchases` (`spokeIntegrationId`);--> statement-breakpoint
CREATE INDEX `customerEmailIdx` ON `purchases` (`customerEmail`);--> statement-breakpoint
CREATE INDEX `paymentStatusIdx` ON `purchases` (`paymentStatus`);--> statement-breakpoint
CREATE INDEX `timestampIdx` ON `purchases` (`timestamp`);