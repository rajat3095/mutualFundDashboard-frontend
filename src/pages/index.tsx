import Head from "next/head";
import { Container, Typography } from "@mui/material";

import InvestorTable from "../components/InvestorTable";

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Head>
        <title>Mutual Fund Dashboard</title>
      </Head>

      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: "medium", mb: 3 }}
      >
        Registered Investors
      </Typography>

      <InvestorTable />
    </Container>
  );
}
