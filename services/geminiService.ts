import { GoogleGenAI, Type, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface SceneDescription {
  scenes: string[];
}

export const parseScriptToScenes = async (script: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following script and break it down into a sequence of distinct visual scenes. For each scene, provide a detailed, one-sentence description suitable for an image generation model. The description should be concise but evocative, focusing on characters, setting, and key actions.

      Script:
      ---
      ${script}
      ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'A detailed visual description for a single storyboard scene.'
              }
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const parsed: SceneDescription = JSON.parse(jsonText);
    return parsed.scenes;
  } catch (error) {
    console.error("Error parsing script to scenes:", error);
    throw new Error("Failed to parse script. Please check the script format and try again.");
  }
};

export const generateImageForScene = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Create a cinematic, photorealistic storyboard panel for this scene: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image for the scene.");
  }
};


export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful assistant for a storyboard generation app. You can answer questions about filmmaking, scriptwriting, or the app itself.',
        }
    });
};
