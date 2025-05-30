import { render, screen } from "@testing-library/react";
import GenerateIllustration from "./GenerateIllustration";

describe("GenerateIllustration", () => {
  test("renders file input", () => {
    render(<GenerateIllustration />);
    expect(screen.getByLabelText(/画像ファイル/)).toBeInTheDocument();
  });

  test("renders style select", () => {
    render(<GenerateIllustration />);
    expect(screen.getByLabelText(/スタイル/)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "アニメ風" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "カートゥーン風" })).toBeInTheDocument();
  });

  test("renders remove background checkbox", () => {
    render(<GenerateIllustration />);
    expect(screen.getByLabelText(/背景を除去してからイラスト化する/)).toBeInTheDocument();
  });

  test("renders generate and remove bg buttons", () => {
    render(<GenerateIllustration />);
    expect(screen.getByRole("button", { name: /イラスト生成/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /背景除去のみ/ })).toBeInTheDocument();
  });
});
