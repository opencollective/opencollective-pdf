export type GraphQLV1Collective = {
  id: number;
  slug: string;
  name: string;
  legalName: string;
  imageUrl: string;
  type: 'COLLECTIVE' | 'EVENT' | 'USER' | 'ORGANIZATION' | 'BOT' | 'PROJECT' | 'FUND' | 'VENDOR';
  isArchived?: boolean;
  parentCollective?: GraphQLV1Collective;
  settings?: Record<string, unknown>;
  isHost?: boolean;
  website: string;
  image: string;
};
