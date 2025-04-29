const { generateContent } = require("../genai/genaiClient");

exports.reviewAnswer = async (req, res) => {
  const { question, correctAnswer, userAnswer } = req.body;

  if (!question || !correctAnswer || !userAnswer) {
    return res
      .status(400)
      .json({ error: "question, correctAnswer and userAnswer are required" });
  }

  const prompt = `
You are a quiz evaluator bot. I will give you:
- a question
- the correct answer
- the user's answer

Your task:
1. Compare the user's answer to the correct one
2. Tell whether it's correct or not (true/false)
3. Generate an explanation in a frontend-friendly structure with:
   - a summary
   - 3-5 sections (each with a title and short content)
   - relatedConcepts as an array of keywords

⚠️ Output STRICTLY in this JSON format (no text outside JSON):

{
  "isCorrect": [true or false],
  "explanation": {
    "summary": "",
    "sections": [
      { "title": "", "content": "" },
      { "title": "", "content": "" }
    ],
    "relatedConcepts": ["", ""]
  }
}

Here is the data:

Question: ${question}  
Correct Answer: ${correctAnswer}  
User's Answer: ${userAnswer}

⚠️ IMPORTANT: Return ONLY valid JSON — no markdown, no backticks, no extra explanation.
`;

  try {
    const result = await generateContent(prompt);

    let cleaned = result.trim();

    // Clean any accidental markdown code blocks
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json/, "").replace(/```/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```/, "").replace(/```/, "").trim();
    }

    const jsonResponse = JSON.parse(cleaned);
    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "AI response is not valid JSON or something went wrong",
      details: error.message,
    });
  }
};



exports.createQuestation = async (req, res) => {
    const { Difficulty, Category, Nofqustation, Type } = req.body;
  
    if (!Difficulty || !Category || !Nofqustation || !Type) {
        return res
          .status(400)
          .json({ error: "difficulty and category are required" });
      }
      const prompt = `
      You are an MCQ question generator.
      
      Generate ${Nofqustation} multiple-choice question based on the following:
      - Category: ${Category}
      - Type: ${Type}
      - Difficulty: ${Difficulty}
      
      Return the question in the following JSON format only (no extra explanation):
      
      {
        "question": "string",
        "incorrect_answers": ["option1", "option2", "option3"],
        "correct_answer": "correct option",
        "explanation": "short explanation of the correct answer"
      }
      
      ⚠️IMPORTANT: Output ONLY valid JSON. No markdown, no code block, no additional text.
        `;
      
        try {
          const result = await generateContent(prompt);
      
          // Clean any markdown-style formatting
          let cleaned = result.trim();
          if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/```json/, '').replace(/```/, '').trim();
          } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```/, '').replace(/```/, '').trim();
          }
      
          const jsonResponse = JSON.parse(cleaned);
          res.status(200).json(jsonResponse);
      
        } catch (error) {
          console.error("Error generating question:", error.message);
          res.status(500).json({
            error: "Failed to generate question",
            details: error.message
          });
        }
};

exports.createQuiz = async (req, res) => {
    const { Difficulty, Category, Nofqustation, Type } = req.body;

    if (!Difficulty || !Category || !Nofqustation || !Type) {
        return res
          .status(400)
          .json({ error: "difficulty and category are required" });
      } 
      const prompt = `
You are a smart quiz generator bot.

Create ${Nofqustation} multiple choice questions based on:
- Category: ${Category}
- Difficulty: ${Difficulty}
- Type: ${Type} (e.g. MCQ)

Each question should include:
- question (string)
- options (array of 4 strings)
- answer (correct option from the options)
- explanation (short explanation of correct answer)

Return ONLY an array of questions in valid JSON like this:

[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "A",
    "explanation": "short explanation"
  },
  ...
]

⚠️IMPORTANT: Respond with ONLY valid JSON — no markdown, no code block, no extra explanation.
  `;

  try {
    const result = await generateContent(prompt);

    // Clean and parse JSON safely
    let cleaned = result.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json/, '').replace(/```/, '').trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```/, '').replace(/```/, '').trim();
    }

    const quizData = JSON.parse(cleaned);
    res.status(200).json(quizData);

  } catch (error) {
    console.error("Quiz generation failed:", error.message);
    res.status(500).json({
      error: "Failed to generate quiz",
      details: error.message
    });
  }
};

exports.createquizfromtext = async (req, res) => {
  const { Difficulty, Category, Nofqustation, Type, text } = req.body;

  if (!Difficulty || !Category || !Nofqustation || !Type || !text) {
    return res.status(400).json({
      error: "Difficulty, Category, Nofqustation, Type, and text are required"
    });
  }

  const prompt = `
  You are a quiz generator AI.
  
  Based on the following study material/text, generate a quiz with:
  
  - A creative and relevant title (string)
  - A one-line description summarizing the topic (string)
  - A category (use: "${Category}")
  - A difficulty level (use: "${Difficulty}")
  - A list of ${Nofqustation} multiple choice questions, each with:
    - question (string)
    - options (array of 4 strings)
    - answer (the correct option from the options)
    - explanation (brief explanation of the correct answer)
  
  Study Text:
  """
  ${text}
  """
  
  Return ONLY a valid JSON object in the following format:
  
  {
    "title": "string",
    "description": "string",
    "category": "${Category}",
    "difficulty": "${Difficulty}",
    "questions": [
      {
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "answer": "A",
        "explanation": "short explanation"
      }
    ]
  }
  
  ⚠️ IMPORTANT: Respond with ONLY valid JSON — no markdown, no code block, no extra explanation.
  `;

  try {
    const result = await generateContent(prompt);

    let cleaned = result.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json/, '').replace(/```/, '').trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```/, '').replace(/```/, '').trim();
    }

    const quizObject = JSON.parse(cleaned);

    // Optionally: Validate that it contains the correct structure
    if (!quizObject.questions || !Array.isArray(quizObject.questions)) {
      throw new Error("Invalid quiz format received from AI");
    }

    res.status(200).json(quizObject);

  } catch (error) {
    console.error("Quiz generation failed:", error.message);
    res.status(500).json({
      error: "Failed to generate quiz",
      details: error.message
    });
  }
};
