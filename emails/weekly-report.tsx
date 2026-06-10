import { Html, Head, Body, Container, Text, Link, Preview, Section, Hr } from "@react-email/components";
import { APP_URL, COLORS } from "../constants";

export default function WeeklyReportEmail({ reportJson }: { reportJson: any }) {
  return (
    <Html>
      <Head />
      <Preview>Your Vyrlo Weekly Performance Report</Preview>
      <Body style={{ backgroundColor: COLORS.bg, color: COLORS.foreground, fontFamily: "sans-serif" }}>
        <Container style={{ margin: "0 auto", padding: "40px 20px", maxWidth: "600px" }}>
          <Text style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
            Your Weekly Report
          </Text>
          
          <Section style={{ padding: "20px", backgroundColor: COLORS.surface, borderRadius: "8px", marginBottom: "20px" }}>
            <Text style={{ fontSize: "18px", fontWeight: "bold", marginTop: 0 }}>Overview</Text>
            <Text style={{ fontSize: "14px", lineHeight: "20px", color: COLORS.muted }}>
              {reportJson.overview}
            </Text>
          </Section>

          <Text style={{ fontSize: "18px", fontWeight: "bold", marginTop: "30px", marginBottom: "10px" }}>Platform Breakdown</Text>
          {reportJson.platformBreakdowns?.map((p: any, idx: number) => (
            <Section key={idx} style={{ padding: "15px", borderLeft: `4px solid ${COLORS.surfaceMid}`, marginBottom: "10px" }}>
              <Text style={{ fontWeight: "bold", margin: 0 }}>{p.platform}</Text>
              <Text style={{ fontSize: "14px", color: COLORS.muted, margin: "5px 0 0 0" }}>{p.summary}</Text>
            </Section>
          ))}

          <Hr style={{ borderColor: COLORS.surfaceMid, margin: "30px 0" }} />

          <Text style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Growth Insights</Text>
          <ul style={{ paddingLeft: "20px", color: COLORS.muted, fontSize: "14px" }}>
            {reportJson.growthInsights?.map((insight: string, idx: number) => (
              <li key={idx} style={{ marginBottom: "5px" }}>{insight}</li>
            ))}
          </ul>

          <Text style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "10px" }}>Recommendations</Text>
          <ul style={{ paddingLeft: "20px", color: COLORS.muted, fontSize: "14px" }}>
            {reportJson.recommendations?.map((rec: string, idx: number) => (
              <li key={idx} style={{ marginBottom: "5px" }}>{rec}</li>
            ))}
          </ul>

          <Section style={{ textAlign: "center", marginTop: "40px" }}>
            <Link 
              href={`${APP_URL}/dashboard`} 
              style={{ color: COLORS.foreground, textDecoration: "underline", fontSize: "14px" }}
            >
              View Full Details on Vyrlo
            </Link>
            <Text style={{ fontSize: "12px", color: COLORS.surfaceMid, marginTop: "20px" }}>
              <Link href={`${APP_URL}/settings`} style={{ color: COLORS.surfaceMid }}>Unsubscribe from reports</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
