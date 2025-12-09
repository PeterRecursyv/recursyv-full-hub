import { trpc } from "@/lib/trpc";

export default function Footer() {
  const { data: branding } = trpc.config.branding.useQuery();

  return (
    <footer className="border-t mt-16 py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-muted-foreground">Email: {branding?.contactEmail}</p>
            <p className="text-sm text-muted-foreground">Phone (UK): {branding?.contactPhoneUK}</p>
            <p className="text-sm text-muted-foreground">Phone (US): {branding?.contactPhoneUS}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Address</h3>
            <p className="text-sm text-muted-foreground">{branding?.address}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {branding?.social?.twitter && (
                <a 
                  href={branding.social.twitter} 
                  className="text-sm text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              )}
              {branding?.social?.linkedin && (
                <a 
                  href={branding.social.linkedin} 
                  className="text-sm text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {branding?.companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
