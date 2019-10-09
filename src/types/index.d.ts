export interface Input {
    /** Assistance is expected */
    readonly assist: boolean;

    /** Number of coins to split [100, 2^63] */
    readonly coins: number;

    /** Match identifier */
    readonly id: string;

    /** Sorted list of pirates in match [2..5] */
    readonly pirates: Pirate[];

    /** Proposition */
    readonly proposition?: {
        /** Proposition identifier */
        readonly id: string;

        /** Share for each pirate [2..5] */
        readonly shares: Share[];
    }

    /** Match state */
    readonly state:
        | "accepted"
        | "proposing"
        | "rejected"
        | "voting";
}

export interface Pirate {
    /** Pirate's owned coins [0, 2^63] */
    readonly coins?: number;

    /** It's you */
    readonly current: boolean;

    /** Pirate's identifier */
    readonly id: string;

    /** Pirate's level */
    readonly level: {
        /** Total coins required for level-up [0, 2^63] */
        readonly coins: number;

        /** Current level [1, 2^31] */
        readonly value: number;
    },

    /** Pirate's metrics */
    readonly metrics?: {
        /** Greed [-1; 1] */
        readonly greed: number;
    };
}

export interface Share {
    /** Pirate is forced to accept this share */
    forced?: boolean;

    /** Pirate, who will get this share */
    pirate: {
        /** Pirate's identifier */
        id: string; 
    };

    /** Pirate has rejected this share */
    rejected?: boolean;

    /** Share value */
    value:
        | 0.00
        | 0.05
        | 0.10
        | 0.15
        | 0.20
        | 0.25
        | 0.30
        | 0.35
        | 0.40
        | 0.45
        | 0.50
        | 0.55
        | 0.60
        | 0.65
        | 0.70
        | 0.75
        | 0.80
        | 0.85
        | 0.90
        | 0.95
        | 1.00;
}
