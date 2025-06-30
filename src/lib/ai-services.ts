// Azure OpenAI Service
export class AzureOpenAIService {
  private baseUrl: string;
  private apiKey: string;
  private apiVersion: string;
  private model: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_AZURE_OPENAI_API_BASE;
    this.apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
    this.apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;
    this.model = import.meta.env.VITE_AZURE_OPENAI_MODEL;
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/openai/deployments/${this.model}/chat/completions?api-version=${this.apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational tutor. Create a comprehensive yet concise summary of the following academic content. Focus on key concepts, main ideas, and important details that would help a student understand and remember the material.'
            },
            {
              role: 'user',
              content: `Please summarize this academic content:\n\n${content}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Failed to generate summary';
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  async generateQuiz(content: string, numQuestions: number = 5): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/openai/deployments/${this.model}/chat/completions?api-version=${this.apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an educational quiz generator. Create ${numQuestions} multiple-choice questions based on the provided content. Return ONLY a valid JSON array with questions in this exact format: [{"id": "1", "question": "Question text?", "options": ["A", "B", "C", "D"], "correct_answer": 0, "explanation": "Why this is correct"}]`
            },
            {
              role: 'user',
              content: `Create a quiz from this content:\n\n${content}`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content_response = data.choices[0]?.message?.content || '[]';
      
      try {
        return JSON.parse(content_response);
      } catch (parseError) {
        console.error('Error parsing quiz JSON:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  async chatWithDocument(messages: any[], documentContent: string): Promise<string> {
    try {
      const systemMessage = {
        role: 'system',
        content: `You are an AI tutor helping students understand their academic materials. Use the following document content to answer questions accurately and helpfully. Document content: ${documentContent.substring(0, 3000)}...`
      };

      const response = await fetch(`${this.baseUrl}/openai/deployments/${this.model}/chat/completions?api-version=${this.apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          messages: [systemMessage, ...messages],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }
}

// ElevenLabs Service
export class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string;
  private voiceId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.baseUrl = import.meta.env.VITE_ELEVENLABS_API_BASE;
    this.voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
  }

  async generateSpeech(text: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }
}

export const azureOpenAI = new AzureOpenAIService();
export const elevenLabs = new ElevenLabsService();