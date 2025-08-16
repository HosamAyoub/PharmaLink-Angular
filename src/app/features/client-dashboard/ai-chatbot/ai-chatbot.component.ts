import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewChecked,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../../environments/environment';

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

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.css',
})
export class AIChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') chatMessagesElement!: ElementRef;
  @ViewChild('chatInput') chatInputElement!: ElementRef;

  // Chat state
  isChatOpen = false;
  isTyping = false;
  isLoading = false;
  isOnline = true;
  hasUnreadMessages = false;
  currentMessage = '';
  messages: ChatMessage[] = [];
  isMobile = false;
  showQuickActions = true;

  // Image upload state
  currentImageData: {
    data: string;
    mimeType: string;
    name: string;
  } | null = null;

  // Quick actions for user convenience
  quickActions = [
    // 'What are the side effects of aspirin?',
    // 'What medications do you have for headaches?',
    // 'What are alternatives to ibuprofen?',
    // 'Tell me about paracetamol dosage',
  ];

  // AI Configuration
  private genAI: GoogleGenerativeAI;
  private model: any;
  private shouldScrollToBottom = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.genAI = new GoogleGenerativeAI(environment.GEMINI_API_KEY);
    this.initializeAI();
    this.checkMobile();
  }

  ngOnInit() {
    this.addWelcomeMessage();
    this.checkConnection();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  private async initializeAI() {
    try {
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-pro',
        generationConfig: {
          temperature: 0.75,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      this.isOnline = true;
    } catch (error) {
      console.error('Failed to initialize AI:', error);
      this.isOnline = false;
    }
  }

  private checkConnection() {
    // Simple connection check
    setInterval(() => {
      this.isOnline = navigator.onLine && !!this.model;
    }, 5000);
  }

  private addWelcomeMessage() {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      content: `Welcome to PharmaLink. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
    };
    this.messages.push(welcomeMessage);
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.hasUnreadMessages = false;
      setTimeout(() => {
        this.focusInput();
      }, 300);
    }
  }

  closeChat() {
    this.isChatOpen = false;
  }

  minimizeChat() {
    this.isChatOpen = false;
  }

  async sendMessage() {
    if (!this.currentMessage.trim() && !this.currentImageData) {
      console.log('❌ Send message blocked: no message or image');
      return;
    }

    if (this.isLoading || !this.isOnline) {
      console.log('❌ Send message blocked:', {
        isLoading: this.isLoading,
        isOnline: this.isOnline,
      });
      return;
    }

    console.log('📨 Sending message:', this.currentMessage.trim());

    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: this.currentMessage.trim() || 'Uploaded an image',
      isUser: true,
      timestamp: new Date(),
      image: this.currentImageData ? { ...this.currentImageData } : undefined,
    };

    this.messages.push(userMessage);
    const messageToSend =
      this.currentMessage.trim() || 'Please analyze this image';
    this.currentMessage = '';

    // Store image data temporarily for the AI request
    const imageForAI = this.currentImageData;

    // Clear the image preview after sending
    this.removeImagePreview();

    this.shouldScrollToBottom = true;

    console.log('🎯 Calling generateAIResponse...');
    await this.generateAIResponse(messageToSend, imageForAI);
  }

  private async generateAIResponse(
    userMessage: string,
    imageData?: { data: string; mimeType: string; name: string } | null
  ) {
    this.isLoading = true;
    this.isTyping = true;
    this.shouldScrollToBottom = true;

    console.log('🚀 Starting AI response generation...');
    console.log('📝 User message:', userMessage);
    console.log('📷 Has image:', !!imageData);

    const startTime = performance.now();

    try {
      // Use the exact same API configuration as working JavaScript code
      const apiUrl =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

      console.log('🔗 API URL:', apiUrl);
      console.log('🔑 API Key exists:', !!environment.GEMINI_API_KEY);
      console.log(
        '🔑 API Key preview:',
        environment.GEMINI_API_KEY
          ? environment.GEMINI_API_KEY.substring(0, 10) + '...'
          : 'NOT SET'
      );

      const requestBody = {
        contents: this.buildPrompt(userMessage, imageData),
        generationConfig: {
          temperature: 0.75,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      };

      console.log(
        '📦 Request body prepared, conversation history length:',
        requestBody.contents.length
      );
      console.log('⚙️ Generation config:', requestBody.generationConfig);

      const fetchStartTime = performance.now();
      console.log('📡 Sending request to Gemini API...');

      const response = await fetch(
        `${apiUrl}?key=${environment.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const fetchEndTime = performance.now();
      console.log(
        `⏱️ Fetch completed in ${(fetchEndTime - fetchStartTime).toFixed(2)}ms`
      );
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${errorText}`
        );
      }

      console.log('📥 Parsing JSON response...');
      const data = await response.json();
      console.log('✅ JSON parsed successfully');
      console.log('📋 Response data structure:', {
        hasCandidates: !!data.candidates,
        candidatesLength: data.candidates?.length,
        hasContent: !!data.candidates?.[0]?.content,
        hasText: !!data.candidates?.[0]?.content?.parts?.[0]?.text,
      });

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('✨ AI Response received, length:', aiResponse.length);
        console.log(
          '📝 AI Response preview:',
          aiResponse.substring(0, 100) + '...'
        );

        console.log('🔄 Updating UI state: isTyping=false, isLoading=false');
        this.isTyping = false;
        this.isLoading = false;

        const aiMessage: ChatMessage = {
          id: this.generateId(),
          content: this.formatAIResponse(aiResponse),
          isUser: false,
          timestamp: new Date(),
        };

        console.log('💬 Adding AI message to chat');
        this.messages.push(aiMessage);
        this.shouldScrollToBottom = true;

        if (!this.isChatOpen) {
          this.hasUnreadMessages = true;
        }

        console.log('🔄 Triggering change detection');
        this.cdr.detectChanges();

        console.log('🔄 Final UI state check:', {
          isTyping: this.isTyping,
          isLoading: this.isLoading,
          messagesCount: this.messages.length,
        });

        const totalTime = performance.now() - startTime;
        console.log(`🎉 Total response time: ${totalTime.toFixed(2)}ms`);
      } else {
        console.error('❌ Invalid response structure:', data);
        this.isTyping = false;
        this.isLoading = false;
        throw new Error('Invalid response format from API');
      }
    } catch (error: any) {
      const totalTime = performance.now() - startTime;
      console.error(`❌ Error after ${totalTime.toFixed(2)}ms:`, error);
      console.error('Error details:', {
        name: error?.name || 'Unknown',
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
      });

      console.log('🔄 Clearing loading states due to error');
      this.isTyping = false;
      this.isLoading = false;

      const errorMessage: ChatMessage = {
        id: this.generateId(),
        content: `Sorry, I'm having trouble connecting right now. Please try again in a moment. (Error: ${
          error?.message || 'Unknown error'
        })`,
        isUser: false,
        timestamp: new Date(),
      };

      this.messages.push(errorMessage);
      this.shouldScrollToBottom = true;

      console.log('🔄 Triggering change detection after error');
      this.cdr.detectChanges();
    } finally {
      console.log('🔄 Finally block: ensuring all loading states are cleared');
      this.isLoading = false;
      this.isTyping = false;
      const totalTime = performance.now() - startTime;
      console.log(
        `🏁 generateAIResponse completed in ${totalTime.toFixed(2)}ms`
      );
      console.log('🔄 Final state in finally block:', {
        isTyping: this.isTyping,
        isLoading: this.isLoading,
      });
    }
  }

  private buildPrompt(
    userMessage: string,
    imageData?: { data: string; mimeType: string; name: string } | null
  ): any[] {
    // Build conversation history exactly like the working JavaScript code
    const conversationHistory = [
      {
        role: 'user',
        parts: [
          {
            text: `You are the PharmaLink virtual assistant. Your job is to help patients look up medication information from our internal Excel database and, when appropriate, augment it with up‑to‑date details from the web. You can also analyze images of medications, prescriptions, or medical documents. Always remain professional, clear, and patient‑focused.

1. **Greeting**  
   - On session start, say:  
     "Welcome to PharmaLink. How can I help you today?"

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
   e. **If none remain**, respond:  
      "I'm sorry, I don't have any safe alternatives to X in our database right now."  
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

    // Add conversation history from current chat (skip current message, it will be added separately)
    this.messages.forEach((msg, index) => {
      if (index < this.messages.length - 1) {
        conversationHistory.push({
          role: msg.isUser ? 'user' : 'model',
          parts: [
            {
              text: msg.content,
            },
          ],
        });
      }
    });

    // Add the current user message with optional image
    const currentMessageParts: any[] = [
      {
        text: userMessage,
      },
    ];

    // Add image data if available
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

    return conversationHistory;
  }

  private formatAIResponse(response: string): string {
    // Basic formatting for better readability
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
  }

  selectQuickAction(action: string) {
    this.currentMessage = action;
    this.sendMessage();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    if (this.chatMessagesElement) {
      const element = this.chatMessagesElement.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private focusInput() {
    if (this.chatInputElement) {
      this.chatInputElement.nativeElement.focus();
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Image handling methods
  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

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

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentImageData = {
        data: e.target.result.split(',')[1], // Remove data:image/...;base64, prefix
        mimeType: file.type,
        name: file.name,
      };
      console.log('📷 Image uploaded:', file.name);
    };
    reader.readAsDataURL(file);
  }

  removeImagePreview() {
    this.currentImageData = null;
    // Clear the file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    console.log('🗑️ Image preview removed');
  }

  getImagePreviewUrl(): string {
    if (this.currentImageData) {
      return `data:${this.currentImageData.mimeType};base64,${this.currentImageData.data}`;
    }
    return '';
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }
}
