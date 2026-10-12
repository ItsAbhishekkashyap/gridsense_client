import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopilotChat } from '../../components/CopilotChat';
import api from '../../lib/api';

// Mock the shared API client (axios instance) used by the copilot
jest.mock('../../lib/api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
const mockedPost = api.post as jest.Mock;

describe('CopilotChat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock smooth scrolling
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the launcher and opens the copilot on click', () => {
    render(<CopilotChat />);

    const launcher = screen.getByRole('button', { name: 'Ask Copilot' });
    expect(launcher).toBeInTheDocument();

    fireEvent.click(launcher);

    expect(screen.getByRole('dialog', { name: 'GridSense Copilot' })).toBeInTheDocument();
    expect(screen.getByText('GridSense Copilot')).toBeInTheDocument();
  });

  it('opens with Ctrl+K', () => {
    render(<CopilotChat />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: 'GridSense Copilot' })).toBeInTheDocument();
  });

  it('sends a message and displays the AI response', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { success: true, message: 'System is running optimally.' },
    });

    render(<CopilotChat />);
    fireEvent.click(screen.getByRole('button', { name: 'Ask Copilot' }));

    const input = screen.getByPlaceholderText('Ask about panels, alerts, or hardware…');
    fireEvent.change(input, { target: { value: 'How is my system?' } });
    expect(input).toHaveValue('How is my system?');

    fireEvent.submit(input.closest('form') as HTMLFormElement);

    // The user's message appears immediately and the input clears
    expect(screen.getByText('How is my system?')).toBeInTheDocument();
    expect(input).toHaveValue('');

    await waitFor(() => {
      expect(screen.getByText('System is running optimally.')).toBeInTheDocument();
    });

    expect(mockedPost).toHaveBeenCalledTimes(1);
    expect(mockedPost).toHaveBeenCalledWith(
      '/copilot/chat',
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: 'How is my system?' }),
        ]),
      })
    );
  });

  it('shows an error message when the backend fails', async () => {
    mockedPost.mockRejectedValueOnce(new Error('down'));
    render(<CopilotChat />);
    fireEvent.click(screen.getByRole('button', { name: 'Ask Copilot' }));
    fireEvent.click(screen.getByRole('button', { name: 'System status' }));
    await waitFor(() => {
      expect(screen.getByText(/encountered an error connecting/i)).toBeInTheDocument();
    });
  });
});
