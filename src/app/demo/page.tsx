import ComingSoon from '@/components/ui/ComingSoon';

export default function DemoPage() {
  return (
    <ComingSoon
      title="Interactive Demo"
      description="We're preparing an interactive demo to showcase all the powerful features of UPSC Dashboard. This will include live demonstrations of our AI assistant, analytics, and study tools."
      expectedDate="Coming Soon"
      features={[
        "AI-Powered Study Assistant Demo",
        "Smart Study Calendar Walkthrough", 
        "Performance Analytics Preview",
        "Question Bank & Practice Demo",
        "Current Affairs Hub Tour"
      ]}
      backLink="/"
      backLinkText="Back to Home"
    />
  );
}
