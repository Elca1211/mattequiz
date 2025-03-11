import { render, screen, fireEvent } from '@testing-library/react';
import MultiplicationGame from './MultiplicationGame';

describe('MultiplicationGame', () => {
  const mockUpdateHighScore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  

  jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.5) // 6
        .mockReturnValueOnce(0.7); // 8

  });


  it('should render MultiplicationGame', () => {
    render(<MultiplicationGame difficulty="easy" updateHighScore={mockUpdateHighScore} />);
    
    expect(screen.getByText(/Fråga 1\/10/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Svara/i })).toBeInTheDocument();
    expect(screen.getByText(/Poäng: 0/i)).toBeInTheDocument();
  }); 


  it('should take correct answer and update score', () => {
      render(<MultiplicationGame difficulty="easy" updateHighScore={mockUpdateHighScore} />);
  
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const answerButton = screen.getByRole('button', { name: /Svara/i });
  
      // Ange förväntat svar som target
      fireEvent.change(input, { target: { value: '48' } });
      fireEvent.click(answerButton);
  
      // Kollar om meddelandet, poängen och numret på frågan stämmer
      expect(screen.getByText(/Fråga 2\/10/i)).toBeInTheDocument();
      expect(screen.getByText(/✅ Rätt svar!/i)).toBeInTheDocument();
      expect(screen.getByText(/Poäng: 1/i)).toBeInTheDocument();
    });


  it('should signal incorrect answer without increasing score', () => {
    render(<MultiplicationGame difficulty="easy" updateHighScore={mockUpdateHighScore} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    const answerButton = screen.getByRole('button', { name: /Svara/i });

    fireEvent.change(input, { target: { value: '999' } });
    fireEvent.click(answerButton);

    expect(screen.getByText(/Poäng: 0/i)).toBeInTheDocument();
  });

  it('should end game after 10 rounds', () => {
    render(<MultiplicationGame difficulty="easy" updateHighScore={mockUpdateHighScore} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    const answerButton = screen.getByRole('button', { name: /Svara/i });

    for (let i = 0; i < 10; i++) {
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.click(answerButton);
    }

    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
   
  });
});
