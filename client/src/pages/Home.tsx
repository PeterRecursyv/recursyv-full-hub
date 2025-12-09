import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    vendorName: "",
    category: "",
    useCase: "",
    email: "",
  });
  const utils = trpc.useUtils();

  // Prefetch data on mount for instant subsequent loads
  useEffect(() => {
    utils.config.allHubVendors.prefetch();
    utils.config.branding.prefetch();
  }, [utils]);

  // Integration request mutation
  const requestIntegrationMutation = trpc.system.notifyOwner.useMutation({
    onSuccess: () => {
      alert("Thank you! Your integration request has been submitted successfully.");
      setIsRequestModalOpen(false);
      setRequestForm({ vendorName: "", category: "", useCase: "", email: "" });
    },
    onError: (error: any) => {
      alert(`Error submitting request: ${error.message}`);
    },
  });

  const handleRequestSubmit = () => {
    requestIntegrationMutation.mutate({
      title: 'New Integration Request',
      content: `Vendor: ${requestForm.vendorName}\nCategory: ${requestForm.category}\nUse Case: ${requestForm.useCase}\nEmail: ${requestForm.email}`
    });
  };

  // Load all hub vendors
  const { data: allHubVendors, isLoading: isLoadingHubs } = trpc.config.allHubVendors.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Load spoke integrations for selected hub
  const { data: spokeIntegrations, isLoading: isLoadingIntegrations } = trpc.config.spokeIntegrationsForHub.useQuery(
    { hubId: selectedHubId! },
    {
      enabled: !!selectedHubId,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const { data: branding } = trpc.config.branding.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const integrations = spokeIntegrations || [];
  const selectedHub = allHubVendors?.find((h) => h.id === selectedHubId);

  // Filter integrations based on search
  const filteredIntegrations = useMemo(() => {
    if (!searchQuery.trim()) return integrations;
    const query = searchQuery.toLowerCase();
    return integrations.filter(
      (integration: any) =>
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query) ||
        integration.categories?.some((cat: string) => cat.toLowerCase().includes(query))
    );
  }, [integrations, searchQuery]);

  const handleIntegrationClick = (spoke: any) => {
    setLocation(`/hub/${selectedHubId}/integration/${spoke.id}`);
  };

  const handleHubSelect = (hubId: string) => {
    setSelectedHubId(hubId);
    setSearchQuery(""); // Clear search when switching hubs
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={branding?.logo || "/assets/logos/recursyv-logo.png"}
                alt="Recursyv"
                className="h-16 w-auto object-contain"
              />
            </div>
            <nav className="flex items-center gap-8">
              <a href="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a href="/about" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                About Us
              </a>
              <a href="/contact" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {!selectedHubId ? (
          /* Hub Selection View */
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-slate-900 mb-4">
                Select Your Integration Hub
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Choose your primary platform to see available integrations and start connecting your tools seamlessly
              </p>
            </div>

            {/* Hub Vendor Grid */}
            <div className="max-w-6xl mx-auto">
              {isLoadingHubs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="bg-white rounded-xl border-2 border-slate-200 p-8 animate-pulse">
                      <div className="h-24 bg-slate-200 rounded-lg mb-4" />
                      <div className="h-6 bg-slate-200 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allHubVendors?.map((hub) => (
                    <button
                      key={hub.id}
                      onClick={() => handleHubSelect(hub.id)}
                      className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 p-8 text-left group"
                    >
                      <div className="flex items-center justify-center mb-6 h-24">
                        <img
                          src={hub.logo}
                          alt={hub.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {hub.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {hub.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hub.categories?.slice(0, 2).map((category, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                        View Integrations
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Request Integration CTA */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-3xl mx-auto border border-blue-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Don't see your platform?
                </h3>
                <p className="text-slate-600 mb-6">
                  Request a new integration and we'll work with you to make it happen
                </p>
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Request Integration
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Hub-Specific Integration View */
          <div className="flex">
            {/* Left Side - Hub Vendor Showcase */}
            <div className="w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex flex-col justify-center sticky top-[73px] h-[calc(100vh-73px)]">
              <div className="max-w-xl">
                {/* Back Button */}
                <button
                  onClick={() => setSelectedHubId(null)}
                  className="mb-6 flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Change Hub
                </button>

                <div className="mb-8">
                  <img
                    src={selectedHub?.logo}
                    alt={selectedHub?.name || "Hub"}
                    className="h-24 w-auto object-contain bg-white rounded-xl p-4 shadow-2xl"
                  />
                </div>
                
                <h1 className="text-4xl font-bold mb-4">
                  {selectedHub?.name} Integration Hub
                </h1>
                
                <p className="text-xl text-blue-100 mb-8">
                  {selectedHub?.description}
                </p>

                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-blue-100">Key Features:</h3>
                  {selectedHub?.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-50">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <p className="text-sm text-blue-100 mb-2">Available Integrations</p>
                  <p className="text-3xl font-bold">{integrations.length}</p>
                  <p className="text-sm text-blue-200 mt-2">Connect with your favorite tools</p>
                </div>
              </div>
            </div>

            {/* Right Side - Integrations List */}
            <div className="w-3/5 p-12 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Available Integrations for {selectedHub?.name}
                  </h2>
                  <p className="text-lg text-slate-600">
                    Choose an integration to get started with seamless data synchronization
                  </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search integrations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-6 text-base rounded-lg border-2 border-slate-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Integrations List */}
                <div className="space-y-3">
                  {isLoadingIntegrations ? (
                    // Loading skeletons
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="bg-white rounded-lg border-2 border-slate-200 animate-pulse">
                        <div className="p-6 flex items-center gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="h-5 bg-slate-200 rounded w-1/3" />
                            <div className="h-4 bg-slate-200 rounded w-2/3" />
                            <div className="flex gap-2">
                              <div className="h-6 bg-slate-200 rounded-full w-16" />
                              <div className="h-6 bg-slate-200 rounded-full w-20" />
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="h-9 w-32 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : filteredIntegrations.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-600 text-lg">No integrations found matching your search.</p>
                    </div>
                  ) : (
                    filteredIntegrations.map((integration: any) => (
                      <div
                        key={integration.id}
                        onClick={() => handleIntegrationClick(integration)}
                        className="bg-white rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      >
                        <div className="p-6 flex items-center gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                              <img
                                src={integration.logo}
                                alt={integration.name}
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">
                              {integration.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {integration.categories?.map((category: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Request Integration CTA */}
                <div className="mt-12">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Need a different integration?
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Request a new integration and we'll work with you to make it happen
                    </p>
                    <Button
                      onClick={() => setIsRequestModalOpen(true)}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      Request Integration
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Integration Request Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request New Integration</DialogTitle>
            <DialogDescription>
              Tell us about the integration you need and we'll get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor/Platform Name *</Label>
              <Input
                id="vendorName"
                placeholder="e.g., Slack, Microsoft Teams"
                value={requestForm.vendorName}
                onChange={(e) => setRequestForm({ ...requestForm, vendorName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={requestForm.category}
                onValueChange={(value) => setRequestForm({ ...requestForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ITSM">ITSM</SelectItem>
                  <SelectItem value="CRM">CRM</SelectItem>
                  <SelectItem value="PSA">PSA</SelectItem>
                  <SelectItem value="RMM">RMM</SelectItem>
                  <SelectItem value="ERP">ERP</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="useCase">Use Case *</Label>
              <Textarea
                id="useCase"
                placeholder="Describe how you plan to use this integration..."
                value={requestForm.useCase}
                onChange={(e) => setRequestForm({ ...requestForm, useCase: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={requestForm.email}
                onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestSubmit}
              disabled={!requestForm.vendorName || !requestForm.useCase || !requestForm.email}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
