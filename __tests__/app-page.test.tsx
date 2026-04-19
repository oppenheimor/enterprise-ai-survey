import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Home from "@/app/page";

vi.mock("@/app/actions", () => ({
  runLocalAssessmentPreview: vi.fn(),
  generateDetailedDiagnosis: vi.fn(),
  submitSurveyLead: vi.fn(),
}));

describe("Home page", () => {
  it("renders the survey landing heading", async () => {
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /别急着做\s*AI，\s*先测清楚\s*值不值得做。/,
      }),
    ).toBeInTheDocument();
  });
});
