import axios from "axios";

const api = axios.create({
  baseURL:
    "http://" +
    process.env.REACT_APP_HOST +
    ":" +
    process.env.REACT_APP_PORT +
    "/api/v0",
});

interface ToolResult {
  name: string;
  time: number;
  vulnerabilities: string[];
}

export interface Analysis {
  id: string;
  results: ToolResult[];
}

export async function sendAnalysisByAddress(address: string): Promise<string> {
  const response = await api.post("/analysis/" + address.toLowerCase());

  if (response.status === 201) {
    return response.data;
  } else {
    // TODO: threat all possible return status
    throw Error("Status code: " + response.status);
  }
}

export async function sendAnalysisByCode(code: File): Promise<string> {
  const formData = new FormData();

  formData.append("file", code, code.name);
  console.log({ formData });

  const response = await api.post("/analysis/", formData);

  if (response.status === 201) {
    return response.data;
  } else {
    // TODO: threat all possible return status
    throw Error("Status code: " + response.status);
  }
}

export async function getAnalysis(id: string): Promise<Analysis> {
  const response = await api.get("/analysis/" + id.toLowerCase());

  if (response.status === 200) {
    return response.data;
  } else {
    // TODO: threat all possible return status
    throw Error("Status code: " + response.status);
  }
}
