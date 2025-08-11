import { users, type User, type InsertUser, type InsertPollVote, type PollVote } from "@shared/schema";
import { promises as fs } from 'fs';
import path from 'path';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  insertPollVote(vote: InsertPollVote): Promise<PollVote>;
  getPollResults(matchId: string): Promise<{ home: number; away: number; draw: number; total: number }>;
  getVoteByMatchAndIP(matchId: string, ipAddress: string): Promise<PollVote | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private votes: PollVote[] = [];
  currentId: number;
  private lastVoteId = 0;
  private votesFilePath = path.join(process.cwd(), 'votes.json');

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.loadVotes();
  }

  private async loadVotes() {
    try {
      const data = await fs.readFile(this.votesFilePath, 'utf-8');
      const savedData = JSON.parse(data);
      this.votes = savedData.votes || [];
      this.lastVoteId = savedData.lastVoteId || 0;
    } catch (error) {
      // File doesn't exist or is corrupted, start with empty votes
      this.votes = [];
      this.lastVoteId = 0;
    }
  }

  private async saveVotes() {
    try {
      const data = {
        votes: this.votes,
        lastVoteId: this.lastVoteId
      };
      await fs.writeFile(this.votesFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving votes:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async insertPollVote(vote: InsertPollVote): Promise<PollVote> {
    const newVote: PollVote = {
      id: ++this.lastVoteId,
      createdAt: new Date().toISOString(),
      ...vote,
    };
    this.votes.push(newVote);
    await this.saveVotes();
    return newVote;
  }

  async getPollResults(matchId: string): Promise<{ home: number; away: number; draw: number; total: number }> {
    const matchVotes = this.votes.filter(vote => vote.matchId === matchId);
    const homeVotes = matchVotes.filter(vote => vote.teamChoice === 'home').length;
    const awayVotes = matchVotes.filter(vote => vote.teamChoice === 'away').length;
    const drawVotes = matchVotes.filter(vote => vote.teamChoice === 'draw').length;
    return {
      home: homeVotes,
      away: awayVotes,
      draw: drawVotes,
      total: homeVotes + awayVotes + drawVotes
    };
  }

  async getVoteByMatchAndIP(matchId: string, ipAddress: string): Promise<PollVote | null> {
    return this.votes.find(vote => vote.matchId === matchId && vote.ipAddress === ipAddress) || null;
  }
}

export const storage = new MemStorage();