import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are PathFinder's AI Academic Advisor — the world's most knowledgeable, empathetic, and practical college guidance counselor for US students.

You specialize in:
- Helping students choose the right major based on their interests, strengths, and career goals
- Recommending universities based on academic profile, budget, and preferences
- Explaining financial aid, FAFSA, scholarships, and student loans in plain English
- Describing career paths, salary expectations, and job market outlooks
- Advising on the college application process, essays, and strategies
- Helping students understand the true cost of college and ROI

Your communication style:
- Warm, encouraging, and honest — never vague or overly optimistic
- Data-driven: cite real salary ranges, acceptance rates, and job growth figures
- Practical: give specific, actionable advice
- Plain English: explain complex financial and academic concepts simply
- Personalized: tailor advice to the student's specific situation when they share it

Key facts you know:
- US undergraduate education costs $3,500–$65,000/year depending on school type
- Average student loan debt at graduation: ~$37,000
- Financial aid: FAFSA determines eligibility for federal grants, loans, and work-study
- Pell Grant: up to $7,395/year for low-income students
- Average starting salaries: CS ~$85k, Nursing ~$61k, Business ~$55k, Education ~$40k
- Community college + transfer (2+2) can save $40k–$80k total
- Top-ranked universities often provide MORE financial aid, making them comparable in net cost to state schools

Be honest about:
- Fields with limited job prospects
- The debt burden of certain career paths
- When graduate school is necessary vs. optional
- The value of community college as a starting point

Always end with a specific question or next step to help the student.`;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        message: "I'm currently running in demo mode — no OpenAI API key is configured. To enable the full AI advisor, add your OPENAI_API_KEY to the .env.local file.\n\nIn the meantime, I can tell you: **the most important factors in choosing a major are (1) genuine interest, (2) job market demand, and (3) return on investment relative to your budget.**\n\nWhat are you most interested in studying?",
      },
      { status: 200 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const { messages, profile } = await req.json();

    const systemWithProfile = profile
      ? `${SYSTEM_PROMPT}\n\nStudent Profile:\n- Grade: ${profile.grade || "Not specified"}\n- GPA: ${profile.gpa || "Not specified"}\n- SAT: ${profile.satScore || "Not specified"}\n- Interests: ${profile.interests?.join(", ") || "Not specified"}\n- Career Values: ${profile.careerValues?.join(", ") || "Not specified"}\n- Budget: ${profile.budgetTier || "Not specified"}\n- Needs Financial Aid: ${profile.needsFinancialAid ? "Yes" : "No"}\n- Preferred States: ${profile.statePreference?.join(", ") || "Flexible"}`
      : SYSTEM_PROMPT;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemWithProfile },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: response.choices[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.",
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "I'm having trouble connecting right now. Please check your API key configuration and try again." },
      { status: 500 }
    );
  }
}
