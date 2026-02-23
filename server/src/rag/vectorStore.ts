// in memory vector database
export interface VectorEntry {
  embedding: number[];
  content: string;
}

export const vectorStore: VectorEntry[] = [];