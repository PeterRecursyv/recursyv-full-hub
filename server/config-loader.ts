import fs from 'fs';
import path from 'path';
import type { HubVendor, SpokeIntegration, BrandingConfig, PricingConfig } from '../shared/config-types';

const CONFIG_DIR = path.join(process.cwd(), 'config');

// In-memory cache for config files to avoid repeated disk reads
const configCache = new Map<string, any>();
const CACHE_TTL = 60000; // 60 seconds cache TTL
const cacheTimestamps = new Map<string, number>();

function getCachedOrLoad<T>(cacheKey: string, loadFn: () => T): T {
  const now = Date.now();
  const cachedTime = cacheTimestamps.get(cacheKey);
  
  // Check if cache is valid
  if (cachedTime && (now - cachedTime) < CACHE_TTL && configCache.has(cacheKey)) {
    return configCache.get(cacheKey) as T;
  }
  
  // Load fresh data
  const data = loadFn();
  configCache.set(cacheKey, data);
  cacheTimestamps.set(cacheKey, now);
  return data;
}

export function loadHubVendor(vendorId: string): HubVendor {
  return getCachedOrLoad(`hub-vendor-${vendorId}`, () => {
    const filePath = path.join(CONFIG_DIR, 'hub-vendors', `${vendorId}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  });
}

export function loadSpokeIntegrations(): SpokeIntegration[] {
  return getCachedOrLoad('spoke-integrations', () => {
    const filePath = path.join(CONFIG_DIR, 'spoke-integrations.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  });
}

export function loadBranding(): BrandingConfig {
  return getCachedOrLoad('branding', () => {
    const filePath = path.join(CONFIG_DIR, 'branding.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  });
}

export function loadPricing(): PricingConfig {
  return getCachedOrLoad('pricing', () => {
    const filePath = path.join(CONFIG_DIR, 'pricing.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  });
}

// Get all available hub vendors
export function loadAllHubVendors(): HubVendor[] {
  return getCachedOrLoad('all-hub-vendors', () => {
    const hubVendorIds = ['hubspot', 'autotask', 'halo', 'servicenow', 'jira', 'connectwise'];
    return hubVendorIds.map(id => loadHubVendor(id));
  });
}

// Get the current hub vendor from environment or default to hubspot
export function getCurrentHubVendorId(): string {
  return process.env.TEMPLATE_HUB_VENDOR || 'hubspot';
}

// Get filtered spoke integrations for the current hub vendor
export function getHubSpokeIntegrations(hubVendor: HubVendor): SpokeIntegration[] {
  const allSpokes = loadSpokeIntegrations();
  return allSpokes.filter(spoke => hubVendor.spokeIntegrations.includes(spoke.id));
}

// Clear cache (useful for development or when config files are updated)
export function clearConfigCache() {
  configCache.clear();
  cacheTimestamps.clear();
}
