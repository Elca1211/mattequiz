import { render, screen, fireEvent } from "@testing-library/react";
import TableMultiplication from "./TableMultiplication";
import useFetch from "../hooks/useFetch";

jest.mock("../hooks/useFetch");

const mockCsvData = [
  { number: 1, table1: 1 },
  { number: 2, table1: 1 },
  { number: 3, table1: 1 },
  { number: 4, table1: 1 },
  { number: 5, table1: 1 },
  { number: 6, table1: 1 },
  { number: 7, table1: 1 },
  { number: 8, table1: 1 },
  { number: 9, table1: 1 },
  { number: 10, table1: 1 },
];

describe("TableMultiplication", () => {
  beforeEach(() => {
    (useFetch as jest.Mock).mockReturnValue({
      fetchCsvData: jest.fn((_, callback) => callback(mockCsvData)),
    });
  });

  it("should render table selection buttons", () => {
    render(<TableMultiplication data={mockCsvData} />);

    expect(screen.getByText("Välj en multiplikationstabell")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(10);
  });

  it("should load questions from the selected table", async () => {
    render(<TableMultiplication data={mockCsvData} />);

    
    fireEvent.click(screen.getByText("Tabell 1"));

    
    expect(screen.getByText("Fråga 1/10")).toBeInTheDocument();
    expect(screen.getByText("1 × 1 = ?")).toBeInTheDocument();
  });

  it("should accept a correct answer and update score", async () => {
    render(<TableMultiplication data={mockCsvData} />);
    fireEvent.click(screen.getByText("Tabell 1"));

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /Svara/i });

    
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.click(button);

    expect(screen.getByText("✅ Rätt svar!")).toBeInTheDocument();
    expect(screen.getByText("Poäng: 1")).toBeInTheDocument();
    expect(screen.getByText("Fråga 2/10")).toBeInTheDocument();
  });


  it("should end game after 10 rounds", async () => {
    render(<TableMultiplication data={mockCsvData} />);
    fireEvent.click(screen.getByText("Tabell 1"));

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /Svara/i });

    for (let i = 0; i < 10; i++) {
      fireEvent.change(input, { target: { value: String(mockCsvData[i].number * mockCsvData[i].table1) } });
      fireEvent.click(button);
    }

    expect(screen.getByText("🎮 Game Over! 🎉")).toBeInTheDocument();
    expect(screen.getByText("Du fick 10 av 10 rätt.")).toBeInTheDocument();
  });

  it("should reset the game after clicking restart", async () => {
    render(<TableMultiplication data={mockCsvData} />);
    fireEvent.click(screen.getByText("Tabell 1"));

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /Svara/i });

    for (let i = 0; i < 10; i++) {
      fireEvent.change(input, { target: { value: String(mockCsvData[i].number * mockCsvData[i].table1) } });
      fireEvent.click(button);
    }

    fireEvent.click(screen.getByText("🔄 Spela igen"));

    expect(screen.getByText("Välj en multiplikationstabell")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(10);
  });
});
