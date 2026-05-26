import { API_BASE_URL } from "../config/apiConfig";

export const fetchImpactMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/impact-metrics`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
    cache: "no-store",
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    throw new Error(json?.message || "Failed to fetch impact metrics");
  }

  return {
    srlSessions: Number(json.data?.srlSessions ?? 0),
    ongoingResearchProjects: Number(json.data?.ongoingResearchProjects ?? 0),
    researchPublications: Number(json.data?.researchPublications ?? 0),
    hackathonWinners: Number(json.data?.hackathonWinners ?? 0),
    hackathonFinalists: Number(json.data?.hackathonFinalists ?? 0),
  };
};
