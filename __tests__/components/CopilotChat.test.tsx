import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopilotChat } from '../../components/CopilotChat';
import axios from 'axios';

// Mock axios for API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CopilotChat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock smooth scrolling
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the toggle button initially and opens chat on click', () => {
    render(<CopilotChat />);
    
    const toggleButton = screen.getByText('Ask AI Copilot');
    expect(toggleButton).toBeInTheDocument();

    // Click to open
    fireEvent.click(toggleButton);
    
    // Chat window should appear with the initial greeting
    expect(screen.getByText('SolarTech Copilot')).toBeInTheDocument();
    expect(screen.getByText('Hello! I am your SolarTech Copilot. How can I help you monitor your grid today?')).toBeInTheDocument();
  });

  it('sends a message and displays the AI response', async () => {
    // Mock the successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, message: 'System is running optimally.' }
    });

    render(<CopilotChat />);
    
    // Open chat
    fireEvent.click(screen.getByText('Ask AI Copilot'));

    // Find input and submit button
    const input = screen.getByPlaceholderText('Ask about your solar panels...');
    const sendButton = input.nextElementSibling as HTMLButtonElement; // The button next to input

    // Type a message
    fireEvent.change(input, { target: { value: 'How is my system?' } });
    expect(input).toHaveValue('How is my system?');

    // Submit
    fireEvent.submit(sendButton.closest('form') as HTMLFormElement);

    // The user's message should appear immediately
    expect(screen.getByText('How is my system?')).toBeInTheDocument();
    
    // The input should be cleared
    expect(input).toHaveValue('');

    // Wait for the AI response to appear
    await waitFor(() => {
      expect(screen.getByText('System is running optimally.')).toBeInTheDocument();
    });

    // Ensure the API was called with the correct payload
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/copilot/chat'),
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: 'How is my system?' })
        ])
      }),
      expect.any(Object)
    );
  });
});
