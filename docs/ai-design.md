# AI / GenAI Design

## 1. AI Strategy
DarwinX uses AI as an **Assistive Intelligence**, not an autonomous decision-maker. The goal is to augment human decision-making, reducing the time HR admins spend on routine tasks.

## 2. Use Cases

### A. Claim Summarization & Classification
- **Problem**: Claims often come with long, unstructured descriptions and attachments.
- **AI Solution**:
    - Extract key facts (Date, Incident Type, Amount).
    - Classify the claim (e.g., "Medical", "Dental", "Vision").
    - Generate a concise summary for the HR approver.
    - **Risk Scoring**: Analyze the text for anomalies or potential fraud indicators (e.g., inconsistent dates).

### B. HR Chatbot (Self-Service)
- **Problem**: HR is overwhelmed with repetitive questions ("What is my dental coverage?").
- **AI Solution**:
    - RAG (Retrieval-Augmented Generation) system.
    - Indexes the company's Benefit Policy documents.
    - Answers employee questions based *only* on the provided context.

## 3. AI Workflow (Claim Analysis)
1.  **Trigger**: New claim submitted.
2.  **Context Assembly**: `AI Service` fetches claim text.
3.  **Prompt Engineering**:
    ```text
    You are an expert insurance claims adjuster.
    Analyze the following claim description:
    "{claim_description}"
    
    Output a JSON object with:
    - summary: (2 sentence summary)
    - category: (Medical | Dental | Vision | Other)
    - risk_score: (0-100)
    - risk_reason: (Why is the risk high?)
    ```
4.  **Processing**: Send to OpenAI GPT-4o-mini (cost-effective).
5.  **Result**: Parse JSON and update Claim record.

## 4. Governance & Ethics
- **Human in the Loop**: AI never auto-rejects a claim. It only flags it. Humans make the final decision.
- **Transparency**: Users are notified when they are interacting with an AI.
- **Data Privacy**: No customer data is used to train public models (Enterprise API agreement).
