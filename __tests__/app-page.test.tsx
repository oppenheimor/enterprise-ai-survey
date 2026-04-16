import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the survey environment heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "企业 AI 转型问卷基础环境已经就绪",
      }),
    ).toBeInTheDocument();
  });
});
