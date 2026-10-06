/**
 * NEXUS — Game Engine Types
 * Type definitions for puzzle nodes, progression, submissions, and game state
 */

export type PuzzleType =
  | 'OBSERVATION'
  | 'BINARY'
  | 'CIPHER'
  | 'PATTERN'
  | 'GRAPH'
  | 'VISUAL'
  | 'AUDIO'
  | 'MEMORY'
  | 'SPATIAL'
  | 'EXTRACTION'
  | 'CROSS_REFERENCE'
  | 'THREE_PHONE'
  | 'DEDUCTION'
  | 'LOGIC'
  | 'NARRATIVE_INVESTIGATION'
  | 'META'
  | 'FINAL'
  | 'FINAL_BOSS'

export type NodeStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'SOLVED' | 'SKIPPED'

export type ValidationMethod = 'exact' | 'case_insensitive' | 'whitespace_normalized' | 'prefix' | 'regex' | 'numeric' | 'symbolic'

/**
 * Map skeleton for a puzzle node, as shipped to the browser.
 *
 * SECURITY: this carries no playable content and no answers. A node's actual
 * content arrives per role from get_player_node_detail(); answers live only in
 * puzzle_nodes.answer_metadata and are read exclusively by
 * submit_puzzle_answer(). The local content module defines its own
 * NodeIndexEntry type, which is what the app actually imports.
 */
export interface PuzzleNode {
  id: string
  code: string
  name: string
  stage: number
  type: PuzzleType
  difficulty: number
  time: string
  location: string
  points: number
  prerequisiteNodes: string[]
  nextNodes: string[] | null
}

export interface RoleContent {
  role: 'OBSERVER' | 'ANALYST' | 'OPERATOR'
  screenTitle: string
  dataPayload: string
  visualType?: string
  interactiveData?: Record<string, unknown>
  whatTheySee: string
  taskPrompt: string
  intermediateOutput: string
}

export interface OperatorInvestigation {
  operatorOwnEvidence: string
  operatorTaskDescription: string
  requiredDiscoveries: {
    observerDiscovery: string
    analystDiscovery: string
  }
}

export interface CoordinationChain {
  observerProduces: string
  analystTransforms: string
  operatorExecutes: string
}

export interface FailurePropagation {
  wrongStep: string
  consequence: string
  recoveryGuidance: string
}

export interface LocationClue {
  format: string
  clueText: string
  solution: string
  nextPhysicalLocation: string
  nextQrNode: string | null
  explanation: string
}

export interface EvidenceUnlocked {
  id: string
  category: string
  title: string
  state: string
  timestamp: string
  source: string
  content: string
}

export interface BranchCondition {
  condition: string
  nextNode: string
  description: string
}

export interface RoleContentMap {
  OBSERVER: RoleContent
  ANALYST: RoleContent
  OPERATOR: RoleContent
}

/**
 * Player-facing node payload from get_player_node_detail().
 *
 * The server returns only the requesting role's own `roleContent`, and
 * redacts the accepted answer out of every string it returns - including
 * `coordinationChain` prose, which states the answer in plain language.
 * `operatorInvestigation` is non-null for OPERATOR only.
 */
export interface NodeDetailPlayerView {
  unlocked: boolean
  /**
   * True when the lead is closed rather than open: the team has solved it.
   * Such a response carries only code, title, stage, location and `reveal`.
   */
  solved?: boolean
  reveal?: NodeReveal | null
  code: string
  title: string
  type: string
  difficulty: number
  estimatedMinutes: number
  location: string
  stage: number
  narrativeObjective: string
  roleDependencyLevel: string
  roleContent: RoleContent | null
  operatorInvestigation: OperatorInvestigation | null
  coordinationChain: CoordinationChain | null
  failurePropagation: FailurePropagation | null
  /** Not sent while a lead is open; see `reveal`. */
  locationClue?: LocationClue | null
  evidenceUnlocked?: EvidenceUnlocked | null
  storyReveal?: string
  whyTeamworkMatters: string
  branchConditions: BranchCondition[]
  points: number
}

export interface TeamGameState {
  team: {
    id: string
    name: string
    code: string
    status: string
    score: number
    startedAt: string | null
    deadline: string | null
    completedAt?: string | null
  }
  progress: {
    solvedCount: number
    currentNodeId: string | null
    availableNodeIds: string[]
  }
  currentNode: {
    code: string
    title: string
    type: string
    location: string
    stage: number
  } | null
  unreadNotifications: number
}

/**
 * What a solved lead gives back. Delivered with a correct answer and again for
 * a lead the team has already closed, and never before: an open lead carries
 * no hint of its own reward or of where the next one is.
 */
export interface NodeReveal {
  /** The terminal's line, or the record the solve produced. */
  storyReveal?: string
  /** Lina's note: the next lead, in her voice. */
  clueText?: string
  nextPhysicalLocation?: string
  evidenceId?: string
  evidenceTitle?: string
  evidenceSource?: string
  evidenceCategory?: string
  /** The recovered document's text. */
  evidenceContent?: string
}

export interface SubmissionResult {
  isCorrect: boolean
  pointsAwarded: number
  attemptNumber: number
  nextNodeId?: string | null
  /** The code of the lead this solve opened, when there is one. */
  nextNodeCode?: string | null
  /** True when this solve closed the case. */
  isFinal?: boolean
  /** Present only on a correct answer. */
  reveal?: NodeReveal | null
  error?: string
  /**
   * Set when the answer could not reach the server and was stored in the local
   * offline queue instead. It has not been validated: `isCorrect` is false only
   * because nothing was checked yet.
   */
  queued?: boolean
  /** When the queued entry was stored. */
  queuedAt?: string
}

export interface HintResult {
  hint: string
  penaltySeconds: number
  error?: string
}

export interface LeaderboardEntry {
  rank: number
  teamName: string
  teamCode: string
  score: number
  status: string
  elapsedMinutes: number
  playerCount: number
}

export interface NodeProgressEntry {
  nodeId: string
  nodeCode: string
  title: string
  type: string
  stage: number
  status: NodeStatus
  startedAt: string | null
  solvedAt: string | null
  attempts: number
  hintsUsed: number
  pointsAwarded: number
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  isRead: boolean
  createdAt: string
  actionUrl: string | null
}

export interface InventoryItem {
  code: string
  name: string
  description: string
  type: string
  rarity: string
}

export interface FragmentItem {
  code: string
  label: string
  content: string
  type: string
  role: string
}

export interface EvidenceItem {
  code: string
  title: string
  description: string
  type: string
  content: Record<string, unknown>
}

export interface ContentValidationIssue {
  nodeId: string
  issue: string
  severity: 'ERROR' | 'WARNING'
}

export interface ContentValidationReport {
  valid: boolean
  nodesChecked: number
  issues: ContentValidationIssue[]
}
