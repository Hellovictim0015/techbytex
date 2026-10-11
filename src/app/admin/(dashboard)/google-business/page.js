import ComingSoon from "../ComingSoon";

export const metadata = {
  title: "Google Business | TechByteX Admin",
  robots: { index: false, follow: false },
};

export default function AdminGoogleBusinessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Google Business Profile</h1>
        <p className="mt-1 text-sm text-slate-400">
          Business information, reviews, posts, and performance insights.
        </p>
      </div>
      <ComingSoon
        title="Google Business Profile integration"
        phase="Phase 5"
        description="API permission/configuration required. This section will show business info, reviews, and insights once GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID/LOCATION_ID are configured and access is granted."
      />
    </div>
  );
}
