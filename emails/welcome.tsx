import { Html, Head, Body, Container, Text, Link, Preview, Section } from "@react-email/components";
import { APP_URL, COLORS } from "../constants";

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Vyrlo!</Preview>
      <Body style={{ backgroundColor: COLORS.bg, color: COLORS.foreground, fontFamily: "sans-serif" }}>
        <Container style={{ margin: "0 auto", padding: "40px 20px" }}>
          <Text style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
            Welcome to Vyrlo, {name}!
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "24px", color: COLORS.muted }}>
            You're successfully set up on Vyrlo — the intelligence layer for serious creators. Here's what you can do right now:
          </Text>
          <Section style={{ padding: "20px", backgroundColor: COLORS.surface, borderRadius: "8px", margin: "20px 0" }}>
            <ul style={{ margin: 0, paddingLeft: "20px", color: COLORS.muted }}>
              <li style={{ marginBottom: "10px" }}>Track your cross-platform growth and engagement in one unified dashboard.</li>
              <li style={{ marginBottom: "10px" }}>Generate AI content ideas tailored to your unique audience and performance data.</li>
              <li>Track competitors and see exactly what's working in your niche.</li>
            </ul>
          </Section>
          <Link 
            href={`${APP_URL}/dashboard`} 
            style={{ 
              display: "inline-block", 
              padding: "12px 24px", 
              backgroundColor: COLORS.foreground, 
              color: COLORS.bg, 
              textDecoration: "none", 
              borderRadius: "4px",
              fontWeight: "bold"
            }}
          >
            Go to Dashboard
          </Link>
        </Container>
      </Body>
    </Html>
  );
}
