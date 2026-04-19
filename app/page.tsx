import { SurveyApp } from "@/components/survey/survey-app";

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const source = typeof params.source === "string" ? params.source : "direct";
  const campaign = typeof params.campaign === "string" ? params.campaign : "organic";

  return <SurveyApp source={source} campaign={campaign} />;
}
