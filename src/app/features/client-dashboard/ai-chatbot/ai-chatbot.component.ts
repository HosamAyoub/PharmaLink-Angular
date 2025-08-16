import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewChecked,
  HostListener,
  ChangeDetectorRef,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { HttpParams } from '@angular/common/http';
import { PatientMedicalInfo } from '../../../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

/**
 * Interface defining the structure of a chat message
 * Supports both text and image messages with metadata
 */
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  image?: {
    data: string;
    mimeType: string;
    name: string;
  };
}

/**
 * AI Chatbot Component for PharmaLink
 *
 * This component provides an intelligent pharmaceutical assistant that can:
 * - Answer medication-related questions
 * - Analyze prescription images and pill photos
 * - Provide drug information and alternatives
 * - Maintain conversation context
 *
 * The component uses Google's Gemini AI model for natural language processing
 * and image analysis capabilities.
 */
@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.css',
})
export class AIChatbotComponent implements OnInit, AfterViewChecked {
  // Template references for DOM manipulation
  @ViewChild('chatMessages') chatMessagesElement!: ElementRef;
  @ViewChild('chatInput') chatInputElement!: ElementRef;

  // Chat state management with signals for reactive updates
  isChatOpen = signal(false); // Controls chat window visibility
  isTyping = signal(false); // Shows typing indicator during AI response
  isLoading = signal(false); // Disables inputs during processing
  isOnline = signal(true); // Connection status indicator
  hasUnreadMessages = signal(false); // Shows notification badge
  currentMessage = signal(''); // Current user input
  messages = signal<ChatMessage[]>([]); // Chat conversation history
  isMobile = signal(false); // Responsive design flag
  showQuickActions = signal(true); // Quick action buttons visibility
  accountId = '';
  medicalInfo = signal<PatientMedicalInfo | null>(null);
  http = inject(HttpClient);
  config = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  url = this.config.getApiUrl(this.endPoint.PATIENT_MEDICAL_INFO);

  // Image upload state with signal
  currentImageData = signal<{
    data: string;
    mimeType: string;
    name: string;
  } | null>(null);

  // Quick action suggestions (currently disabled)
  quickActions = [];

  // AI Configuration
  private genAI: GoogleGenerativeAI;
  private model: any;
  private shouldScrollToBottom = false; // Auto-scroll trigger flag

  /**
   * Constructor initializes the AI service and checks device type
   */
  constructor(private cdr: ChangeDetectorRef) {
    this.genAI = new GoogleGenerativeAI(environment.GEMINI_API_KEY);
    this.initializeAI();
    this.checkMobile();
  }

  /**
   * Component initialization
   * Sets up welcome message and connection monitoring
   */
  ngOnInit() {
    this.addWelcomeMessage();
    this.checkConnection();
    this.loadPatientMedicalInfo();
  }

  /**
   * Handles auto-scrolling after view updates
   * Ensures latest messages are visible
   */
  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * Responsive design handler
   * Updates mobile flag on window resize
   */
  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  /**
   * Detects mobile devices for responsive UI
   */
  private checkMobile() {
    this.isMobile.set(window.innerWidth <= 768);
  }

  /**
   * Initializes the Google Gemini AI model
   * Configures generation parameters for pharmaceutical assistance
   */
  private async initializeAI() {
    try {
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-pro',
        // generationConfig: {
        //   temperature: 0.75, // Balanced creativity/accuracy
        //   topP: 0.8, // Nucleus sampling
        //   topK: 40, // Top-k sampling
        //   maxOutputTokens: 2048, // Response length limit
        // },
      });
      this.isOnline.set(true);
    } catch (error) {
      this.isOnline.set(false);
    }
  }

  /**
   * Monitors connection status periodically
   * Checks both network connectivity and AI model availability
   */
  private checkConnection() {
    setInterval(() => {
      this.isOnline.set(navigator.onLine && !!this.model);
    }, 5000);
  }

  /**
   * Adds the initial welcome message to start conversation
   */
  private addWelcomeMessage() {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      content: `Welcome to PharmaLink. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
    };
    this.messages.update((messages) => [...messages, welcomeMessage]);
  }

  /**
   * Toggles chat window visibility
   * Focuses input and clears notifications when opened
   */
  toggleChat() {
    this.isChatOpen.update((isOpen) => !isOpen);
    if (this.isChatOpen()) {
      this.hasUnreadMessages.set(false);
      setTimeout(() => {
        this.focusInput();
      }, 300);
    }
  }

  /**
   * Closes the chat window
   */
  closeChat() {
    this.isChatOpen.set(false);
  }

  /**
   * Minimizes the chat window (same as close for now)
   */
  minimizeChat() {
    this.isChatOpen.set(false);
  }

  /**
   * Sends user message to AI and handles the conversation flow
   * Validates input, creates user message, and triggers AI response
   */
  async sendMessage() {
    // Validate input requirements
    if (!this.currentMessage().trim() && !this.currentImageData()) {
      return;
    }

    // Prevent duplicate requests
    if (this.isLoading() || !this.isOnline()) {
      return;
    }

    // Create user message object
    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: this.currentMessage().trim() || 'Uploaded an image',
      isUser: true,
      timestamp: new Date(),
      image: this.currentImageData()
        ? { ...this.currentImageData()! }
        : undefined,
    };

    // Add to conversation and prepare for AI request
    this.messages.update((messages) => [...messages, userMessage]);
    const messageToSend =
      this.currentMessage().trim() || 'Please analyze this image';
    this.currentMessage.set('');

    // Store image temporarily and clear preview
    const imageForAI = this.currentImageData();
    this.removeImagePreview();

    this.shouldScrollToBottom = true;

    // Generate AI response
    await this.generateAIResponse(messageToSend, imageForAI);
  }

  /**
   * Generates AI response using Google Gemini API
   * Handles both text and image inputs with comprehensive error handling
   *
   * @param userMessage - The user's text message
   * @param imageData - Optional image data for analysis
   */
  private async generateAIResponse(
    userMessage: string,
    imageData?: { data: string; mimeType: string; name: string } | null
  ) {
    // Set loading states to update UI
    this.isLoading.set(true);
    this.isTyping.set(true);
    this.shouldScrollToBottom = true;

    try {
      // Send request to Google Gemini API
      const response = await this.sendGeminiRequest(userMessage, imageData);

      // Process successful response
      await this.processSuccessfulResponse(response);
    } catch (error: any) {
      // Handle any errors that occur during the process
      this.handleAIResponseError(error);
    } finally {
      // Always clear loading states regardless of success or failure
      this.clearLoadingStates();
    }
  }

  /**
   * Sends the actual HTTP request to Google Gemini API
   *
   * @param userMessage - User's text message
   * @param imageData - Optional image data
   * @returns Promise with the API response
   */
  private async sendGeminiRequest(
    userMessage: string,
    imageData?: { data: string; mimeType: string; name: string } | null
  ): Promise<Response> {
    const apiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

    const requestBody = {
      contents: this.buildPrompt(userMessage, imageData),
      generationConfig: this.getGenerationConfig(),
    };

    const response = await fetch(
      `${apiUrl}?key=${environment.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`
      );
    }

    return response;
  }

  /**
   * AI Generation Configuration
   * These parameters control how the AI generates responses
   *
   * @returns Configuration object for AI text generation
   */
  private getGenerationConfig() {
    return {
      /* TEMPERATURE (0.0 - 2.0): Controls creativity vs consistency */
      temperature: 0.75,

      /* TOP-P (0.0 - 1.0): Nucleus sampling - controls diversity of word choices */
      topP: 0.8,

      /* TOP-K (1 - 100): Limits to top K most likely next words */
      topK: 40,

      /* MAX OUTPUT TOKENS: Maximum length of the AI response */
      maxOutputTokens: 2048,
    };
  }

  /**
   * Processes a successful API response
   *
   * @param response - The HTTP response from Gemini API
   */
  private async processSuccessfulResponse(response: Response): Promise<void> {
    const data = await response.json();

    // Validate response structure
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Create AI message object
      const aiMessage: ChatMessage = {
        id: this.generateId(),
        content: this.formatAIResponse(aiResponse),
        isUser: false,
        timestamp: new Date(),
      };

      // Add to conversation and update UI
      this.messages.update((messages) => [...messages, aiMessage]);
      this.shouldScrollToBottom = true;

      // Show notification if chat is closed
      if (!this.isChatOpen()) {
        this.hasUnreadMessages.set(true);
      }
    } else {
      throw new Error('Invalid response format from API');
    }
  }

  /**
   * Handles errors during AI response generation
   *
   * @param error - The error that occurred
   */
  private handleAIResponseError(error: any): void {
    const errorMessage: ChatMessage = {
      id: this.generateId(),
      content: `Sorry, I'm having trouble connecting right now. Please try again in a moment.`,
      isUser: false,
      timestamp: new Date(),
    };

    this.messages.update((messages) => [...messages, errorMessage]);
    this.shouldScrollToBottom = true;
  }

  /**
   * Clears all loading states to restore normal UI
   */
  private clearLoadingStates(): void {
    this.isLoading.set(false);
    this.isTyping.set(false);
  }

  /**
   * Builds the conversation prompt for the AI model
   * Creates a complete conversation context including system instructions and message history
   *
   * @param userMessage - Current user message text
   * @param imageData - Optional image data for analysis
   * @returns Formatted conversation array for Gemini API
   */
  private buildPrompt(
    userMessage: string,
    imageData?: { data: string; mimeType: string; name: string } | null
  ): any[] {
    // Initialize conversation with system instructions and AI's initial response
    const conversationHistory = this.createSystemPrompt();

    // Add all previous conversation messages (excluding the current one being sent)
    this.addConversationHistory(conversationHistory);

    // Add the current user message with optional image
    this.addCurrentMessage(conversationHistory, userMessage, imageData);

    return conversationHistory;
  }

  /**
   * Creates the system prompt with AI assistant instructions
   * This defines the AI's role, capabilities, and behavior guidelines
   *
   * @returns Initial conversation array with system instructions
   */
  private createSystemPrompt(): any[] {
    return [
      {
        role: 'user',
        parts: [
          {
            text: `You are the PharmaLink virtual assistant. Your job is to help patients look up medication information from our internal Excel database and, when appropriate, augment it with up‑to‑date details from the web. You can also analyze images of medications, prescriptions, or medical documents. Always remain professional, clear, and patient‑focused.

1. **Greeting**  
   - On session start, say: "Welcome to PharmaLink. How can I help you today?"

2. **Image Analysis Capabilities**
   - When users share images, you can:
     * Identify medications from pill images (shape, color, markings, imprints)
     * Read prescription labels and extract medication names, dosages, instructions
     * Analyze medical documents, charts, or medication lists
     * Help identify potential drug interactions from medication photos
   - Always cross-reference identified medications with the Excel database when possible
   - For prescription images, remind users to verify information with their pharmacist

3. **Data Lookup Workflow**  
   When a user asks about any attribute of a medication (e.g. active ingredient, indications, dosage, contraindications, warnings, alternatives), do the following steps in order:  
   a. **Parse the request** to identify the drug name and the specific field requested.  
   b. **Query the Excel sheet** for that drug's record.  
   c. **If found**, extract the raw text for the requested field (e.g. "insulin detemir" for active ingredient).  
   d. **Human‑readable rewrite**: Rephrase and organize that raw text into short, clear sentences or bullet points.  
   e. **Optional web lookup**: Offer to enrich or clarify your answer by searching reliable online sources (e.g. FDA labels, WHO, PubMed abstracts). If you do so, cite or mention the source.  
   f. **Deliver the answer** in one coherent response.

4. **Alternative‑Drug Logic**  
   When a user asks "What are the alternatives to X?":  
   a. **Clarify patient context**: Ask about the patient's relevant history (e.g. "Do you have any known allergies, chronic conditions, or current medications?").  
   b. **From the Excel sheet**, find X's AlternativeGpID.  
   c. **Retrieve all drugs** sharing that AlternativeGpID.  
   d. **Filter** out any alternatives that conflict with the patient's stated history, contraindications, or warnings.  
   e. **If none remain**, respond: "I'm sorry, I don't have any safe alternatives to X in our database right now."  
   f. **If one or more remain**, list each with:  
      1. **Name**  
      2. **Key info** (active ingredient, main indications, major warnings)  
      3. **Tailored note** (e.g. "Because you have gout, Aspirin is not recommended; here are your options.")  
      4. **Dosage disclaimer**: "Please consult your doctor or pharmacist to confirm dosage and appropriateness for your situation."

5. **Out‑of‑Scope Questions**  
   If the user asks anything beyond medication information or image analysis (e.g. legal advice, insurance questions, unrelated medical diagnostics), respond:  
   "I'm here to help with medication information and image analysis only. For other questions, please consult a qualified professional."

6. **Tone & Style**  
   - Use short paragraphs or bullet lists.  
   - Avoid medical jargon where possible; explain any necessary technical terms.  
   - Always include a friendly reminder to verify dosage and treatment plans with a healthcare provider.

7. **Medicine Not in Database**
   - If a medicine name doesn't exist in the CommonName column, say: "This medicine isn't available in any nearby pharmacies right now"
   - Then provide basic general information about the medicine from reliable sources
   - Always clarify that this information is from external sources, not our internal database

8. **Alternative Medicine Logic**
   - Medicines with the same active ingredient are alternatives to each other
   - For example: "eptifibatide Injection" and "Eptifibatide" are alternatives (same active ingredient)
   - But "Abciximab" and "tinzaparin sodium" are NOT alternatives (different active ingredients)
   - Use both CommonName and ActiveIngredient columns to determine alternatives

9. **Conversation Context**
   - Remember all previous medications, patient history, and context discussed in this conversation
   - Reference previous information when relevant (e.g., "You mentioned earlier that you have diabetes..." or "Regarding the aspirin we discussed...")
   - Build upon previous answers and maintain conversation continuity

**Database Instructions:**
- Search for any medicine name in the column called "CommonName", then find its details in the same row
- Make the AI chat work for all medicines in the Excel, not just specific ones
- Don't answer about any medicine whose name doesn't exist in the CommonName - follow rule 7 above
- Both CommonName (medicine name) and ActiveIngredient are key columns in the excel

**Important:** Don't mention "from our data" - just answer the user's question naturally. You can search for additional details if the medicine exists in the Excel sheet.`,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: `Welcome to PharmaLink. How can I help you today?`,
          },
        ],
      },
    ];
  }

  /**
   * Adds previous conversation messages to maintain context
   * This allows the AI to remember the entire conversation history
   *
   * @param conversationHistory - The conversation array to append to
   */
  private addConversationHistory(conversationHistory: any[]): void {
    const currentMessages = this.messages();

    // Add all messages except the last one (which is the current user message being processed)
    currentMessages.forEach((msg, index) => {
      if (index < currentMessages.length - 1) {
        conversationHistory.push({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    });
  }

  /**
   * Adds the current user message with optional image to the conversation
   *
   * @param conversationHistory - The conversation array to append to
   * @param userMessage - The current user's text message
   * @param imageData - Optional image data for analysis
   */
  private addCurrentMessage(
    conversationHistory: any[],
    userMessage: string,
    imageData?: { data: string; mimeType: string; name: string } | null
  ): void {
    const currentMessageParts: any[] = [{ text: userMessage }];

    // Add image data if provided for multimodal analysis
    if (imageData) {
      currentMessageParts.push({
        inline_data: {
          mime_type: imageData.mimeType,
          data: imageData.data,
        },
      });
    }

    conversationHistory.push({
      role: 'user',
      parts: currentMessageParts,
    });
  }

  /**
   * Formats AI response text for better HTML display
   * Converts markdown-style formatting to HTML tags
   *
   * @param response - Raw AI response text
   * @returns HTML-formatted response string
   */
  private formatAIResponse(response: string): string {
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/• /g, '• '); // Bullet points
  }

  /**
   * Handles quick action button clicks
   * Sets the message and sends it automatically
   *
   * @param action - Pre-defined quick action text
   */
  selectQuickAction(action: string) {
    this.currentMessage.set(action);
    this.sendMessage();
  }

  /**
   * Handles keyboard shortcuts in the input field
   * Enter sends message, Shift+Enter creates new line
   *
   * @param event - Keyboard event
   */
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Scrolls chat messages to the bottom
   * Ensures latest messages are visible
   */
  private scrollToBottom() {
    if (this.chatMessagesElement) {
      const element = this.chatMessagesElement.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  /**
   * Focuses the chat input field
   * Called when chat window opens
   */
  private focusInput() {
    if (this.chatInputElement) {
      this.chatInputElement.nativeElement.focus();
    }
  }

  /**
   * Generates unique ID for messages
   * Combines timestamp and random string for uniqueness
   *
   * @returns Unique message ID
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Formats timestamp for message display
   * Shows time in user's local format
   *
   * @param date - Message timestamp
   * @returns Formatted time string
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  /**
   * Handles file upload for image analysis
   * Validates file type and converts to base64
   *
   * @param event - File input change event
   */
  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate supported image formats
    const supportedImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
    ];

    if (!supportedImageTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, GIF, WebP, BMP).');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentImageData.set({
        data: e.target.result.split(',')[1], // Remove data URL prefix
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  }

  /**
   * Removes the current image preview
   * Clears both the preview data and file input
   */
  removeImagePreview() {
    this.currentImageData.set(null);

    // Clear the file input element
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Gets the image preview URL for display
   * Constructs data URL from base64 image data
   *
   * @returns Data URL for image display
   */
  getImagePreviewUrl(): string {
    const imageData = this.currentImageData();
    if (imageData) {
      return `data:${imageData.mimeType};base64,${imageData.data}`;
    }
    return '';
  }

  /**
   * TrackBy function for Angular's *ngFor optimization
   * Helps Angular track message changes efficiently
   *
   * @param index - Array index
   * @param message - Chat message object
   * @returns Unique identifier for tracking
   */
  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  private loadPatientMedicalInfo() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData._token;
    if (!token) {
      return;
    }

    const claims = jwtDecode(token) as Record<string, any>;
    this.accountId =
      claims[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    if (!this.accountId) {
      return;
    }

    const params = new HttpParams().set('accountId', this.accountId);
    this.http.get<PatientMedicalInfo>(this.url, { params }).subscribe({
      next: (profileData: PatientMedicalInfo) => {
        this.medicalInfo.set(profileData);
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
      },
    });
  }
}
