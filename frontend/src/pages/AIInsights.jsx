import {
  useState,
} from "react";

import axios from "axios";

function AIInsights() {
  const [summary,
    setSummary] =
    useState("");

  const generateSummary =
    async () => {
      const res =
        await axios.post(
          "http://localhost:5000/api/ai/summary",
          {
            totalTasks: 50,
            completedTasks: 35,
            overdueTasks: 5,
          }
        );

      setSummary(
        res.data.summary
      );
    };

  return (
    <div>
      <h1>
        AI Insights
      </h1>

      <button
        onClick={
          generateSummary
        }
      >
        Generate
        Summary
      </button>

      <pre>
        {summary}
      </pre>
    </div>
  );
}

export default AIInsights;