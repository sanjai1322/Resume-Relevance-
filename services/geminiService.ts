import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ResumeAnalysis, JDSkills as JDSkillsType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    jdSkills: {
      type: Type.OBJECT,
      description: "Key hard and soft skills extracted from the job description.",
      properties: {
        hardSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of technical or domain-specific skills required."
        },
        softSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of interpersonal or behavioral skills required."
        }
      },
       required: ["hardSkills", "softSkills"]
    },
    resumeAnalyses: {
      type: Type.ARRAY,
      description: "An analysis for each resume provided.",
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: {
            type: Type.STRING,
            description: "The name of the resume file."
          },
          finalScore: {
            type: Type.INTEGER,
            description: "Overall relevance score from 0 to 100, based on skills match."
          },
          verdict: {
            type: Type.STRING,
            description: "A verdict of 'High', 'Medium', or 'Low' relevance."
          },
          hardSkillScore: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 based on the hard skills match."
          },
          softSkillScore: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 based on the soft skills match."
          },
          matchedSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of skills from the job description that were found in the resume."
          },
          missingSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of skills from the job description that were NOT found in the resume."
          },
          summary: {
            type: Type.STRING,
            description: "A concise, one-sentence summary of the candidate's fit for the role."
          }
        },
        required: ["fileName", "finalScore", "verdict", "hardSkillScore", "softSkillScore", "matchedSkills", "missingSkills", "summary"]
      }
    }
  },
  required: ["jdSkills", "resumeAnalyses"]
};


export const analyzeResumes = async (jobDescription: File, resumes: File[]): Promise<AnalysisResult> => {
  const jdPart = await fileToGenerativePart(jobDescription);
  const resumeParts = await Promise.all(resumes.map(fileToGenerativePart));

  const contents = [
    { text: "Here is the job description:" },
    jdPart,
    { text: "Here are the resumes to analyze against the job description:" },
    ...resumeParts
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: contents,
    },
    config: {
        systemInstruction: `You are an expert HR analyst specializing in tech recruitment. Your task is to analyze resumes against a job description. 
        First, identify the key hard and soft skills from the job description. Then, for each resume, calculate a relevance score by comparing the resume's content against the extracted skills.
        Provide a detailed, structured analysis in the specified JSON format. Ensure every field in the schema is populated accurately. The file names must match the ones provided.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    },
  });

  const responseText = response.text.trim();
  try {
    const result = JSON.parse(responseText);
    // Basic validation
    if (!result.jdSkills || !result.resumeAnalyses) {
        throw new Error("Invalid JSON structure received from API.");
    }
    return result as AnalysisResult;
  } catch(e) {
    console.error("Failed to parse JSON response:", responseText);
    throw new Error("Could not parse the analysis from the AI. The response was not valid JSON.");
  }
};

export const getExplanation = async (resumeAnalysis: ResumeAnalysis, jdSkills: JDSkillsType): Promise<string> => {
    const prompt = `
      Based on the following analysis, provide a brief, natural language explanation of this candidate's suitability.
      
      Job Skills Required:
      - Hard Skills: ${jdSkills.hardSkills.join(', ')}
      - Soft Skills: ${jdSkills.softSkills.join(', ')}

      Candidate's Resume Analysis:
      - File: ${resumeAnalysis.fileName}
      - Overall Score: ${resumeAnalysis.finalScore}/100
      - Verdict: ${resumeAnalysis.verdict}
      - Matched Skills: ${resumeAnalysis.matchedSkills.join(', ')}
      - Missing Skills: ${resumeAnalysis.missingSkills.join(', ')}
      
      Start by stating the overall fit (e.g., "This resume is a strong match...") and then elaborate on strengths and weaknesses regarding the key skills required for the job. Keep it to 2-3 sentences.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
}
