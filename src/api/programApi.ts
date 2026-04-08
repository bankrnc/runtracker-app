import { apiClient } from "../lib/apiClient";
import type {
  ProgramApiInput,
  KmLog,
  LogKmInput,
  Program,
} from "../schemas/program.schema";

export const programApi = {
  generate: async (data: ProgramApiInput): Promise<Program> => {
    const res = await apiClient.post<{ program: Program }>("/programs/generate", data);
    return res.data.program;
  },

  getAll: async (): Promise<Program[]> => {
    const res = await apiClient.get<{ programs: Program[] }>("/programs");
    return res.data.programs;
  },

  getById: async (id: number): Promise<Program> => {
    const res = await apiClient.get<{ program: Program }>(`/programs/${id}`);
    return res.data.program;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/programs/${id}`);
  },

  logKm: async (
    sessionId: number,
    data: LogKmInput,
  ): Promise<{ kmLogs: KmLog[]; score: number }> => {
    const res = await apiClient.post<{ kmLogs: KmLog[]; score: number }>(
      `/programs/sessions/${sessionId}/log`,
      data,
    );
    return res.data;
  },
};
