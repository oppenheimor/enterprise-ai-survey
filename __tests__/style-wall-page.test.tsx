import { render, screen, within } from "@testing-library/react";

import StyleWallPage from "@/app/style-wall/page";
import { stylePresets } from "@/lib/style-wall";

describe("StyleWallPage", () => {
  it("renders the style wall heading and all 15 style cards", () => {
    render(<StyleWallPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "企业 AI 转型问卷风格样品墙",
      }),
    ).toBeInTheDocument();

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(stylePresets.length);

    for (const preset of stylePresets) {
      const card = screen.getByRole("article", {
        name: `${preset.label} style sample`,
      });
      expect(within(card).getByText(preset.label)).toBeInTheDocument();
      expect(within(card).getByText("Enterprise AI Survey")).toBeInTheDocument();
      expect(within(card).getByText("开始 3 分钟测评")).toBeInTheDocument();
    }
  });
});
