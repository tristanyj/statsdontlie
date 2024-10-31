import * as d3 from 'd3';

// stats: {
// "regular-season.general.games": 197,
// "regular-season.passing.completions": 4429,
// "regular-season.passing.attempts": 6821,
// "regular-season.passing.completion-percentage": 64.9,
// "regular-season.passing.yards": 51255,
// "regular-season.passing.touchdowns": 412,
// "regular-season.passing.interceptions": 89,
// "regular-season.passing.rating": 102.4,
// "regular-season.passing.sacks": 413,
// "regular-season.rushing.attempts": 611,
// "regular-season.rushing.yards": 2972,
// "regular-season.rushing.touchdowns": 28,
// "regular-season.rushing.first-downs": 174,
// "regular-season.rushing.fumbles": 47,
// "post-season.general.games": 18,
// "post-season.passing.completions": 386,
// "post-season.passing.attempts": 591,
// "post-season.passing.completion-percentage": 65.3,
// "post-season.passing.yards": 4630,
// "post-season.passing.touchdowns": 40,
// "post-season.passing.interceptions": 10,
// "post-season.passing.rating": 99.4,
// "post-season.passing.sacks": 51,
// "post-season.rushing.attempts": 64,
// "post-season.rushing.yards": 386,
// "post-season.rushing.touchdowns": 4,
// "post-season.rushing.first-downs": 23,
// "post-season.rushing.fumbles": 3,
// "awards.individual.mvp": 3,
// "awards.individual.sb-mvp": 1,
// "awards.individual.pro-bowl": 9,
// "awards.individual.all-pro": 3,
// "awards.team.sb-appearance": 1,
// "awards.team.sb-win": 1
// }

export interface Column {
  id: string;
  name: string;
  meta: {
    scale: d3.ScaleContinuousNumeric<number, number>;
    format: (n: number) => string;
    labels: {
      value: number;
      position: number;
    }[];
  };
  record: {
    value: number;
    playerId: string;
  };
}

interface Group {
  id: string;
  name: string;
  subgroups: SubGroup[];
}

interface SubGroup {
  id: string;
  name: string;
  columns: Column[];
}

export const useConfigStore = defineStore(
  'config',
  () => {
    const statGroups: Group[] = [
      {
        id: 'regular-season',
        name: 'Regular Season',
        subgroups: [
          {
            id: 'general',
            name: 'General',
            columns: [
              {
                id: 'games',
                name: 'Games Played',
                meta: {
                  scale: d3.scaleLinear().domain([0, 1000]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 250,
                      position: 0.4,
                    },
                    {
                      value: 500,
                      position: 0.6,
                    },
                    {
                      value: 750,
                      position: 0.8,
                    },
                    {
                      value: 1000,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 197,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
          {
            id: 'passing',
            name: 'Passing',
            columns: [
              {
                id: 'yards',
                name: 'Passing Yards',
                meta: {
                  scale: d3.scaleLog().domain([30000, 90000]),
                  format: (n: number) => `${(n / 1000).toFixed(1)}k`,
                  labels: [
                    {
                      value: 30000,
                      position: 0.2,
                    },
                    {
                      value: 50000,
                      position: 0.4,
                    },
                    {
                      value: 70000,
                      position: 0.6,
                    },
                    {
                      value: 90000,
                      position: 0.8,
                    },
                  ],
                },
                record: {
                  value: 51255,
                  playerId: 'peyton-manning',
                },
              },
              {
                id: 'touchdownq',
                name: 'Passing TDs',
                meta: {
                  scale: d3.scaleLog().domain([0, 1000]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 250,
                      position: 0.4,
                    },
                    {
                      value: 500,
                      position: 0.6,
                    },
                    {
                      value: 750,
                      position: 0.8,
                    },
                    {
                      value: 1000,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 412,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
          {
            id: 'rushing',
            name: 'Rushing',
            columns: [
              {
                id: 'yards',
                name: 'Rushing Yards',
                meta: {
                  scale: d3.scaleLog().domain([0, 10000]),
                  format: (n: number) => `${(n / 1000).toFixed(1)}k`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 2500,
                      position: 0.4,
                    },
                    {
                      value: 5000,
                      position: 0.6,
                    },
                    {
                      value: 7500,
                      position: 0.8,
                    },
                    {
                      value: 10000,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 2972,
                  playerId: 'peyton-manning',
                },
              },
              {
                id: 'touchdowns',
                name: 'Rushing TDs',
                meta: {
                  scale: d3.scaleLog().domain([0, 100]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 25,
                      position: 0.4,
                    },
                    {
                      value: 50,
                      position: 0.6,
                    },
                    {
                      value: 75,
                      position: 0.8,
                    },
                    {
                      value: 100,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 28,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'post-season',
        name: 'Post Season',
        subgroups: [
          {
            id: 'general',
            name: 'General',
            columns: [
              {
                id: 'games',
                name: 'Games Played',
                meta: {
                  scale: d3.scaleLinear().domain([0, 100]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 25,
                      position: 0.4,
                    },
                    {
                      value: 50,
                      position: 0.6,
                    },
                    {
                      value: 75,
                      position: 0.8,
                    },
                    {
                      value: 100,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 18,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
          {
            id: 'passing',
            name: 'Passing',
            columns: [
              {
                id: 'yards',
                name: 'Passing Yards',
                meta: {
                  scale: d3.scaleLog().domain([0, 10000]),
                  format: (n: number) => `${(n / 1000).toFixed(1)}k`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 2500,
                      position: 0.4,
                    },
                    {
                      value: 5000,
                      position: 0.6,
                    },
                    {
                      value: 7500,
                      position: 0.8,
                    },
                    {
                      value: 10000,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 4630,
                  playerId: 'peyton-manning',
                },
              },
              {
                id: 'touchdowns',
                name: 'Passing TDs',
                meta: {
                  scale: d3.scaleLog().domain([0, 100]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 25,
                      position: 0.4,
                    },
                    {
                      value: 50,
                      position: 0.6,
                    },
                    {
                      value: 75,
                      position: 0.8,
                    },
                    {
                      value: 100,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 40,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
          {
            id: 'rushing',
            name: 'Rushing',
            columns: [
              {
                id: 'yards',
                name: 'Rushing Yards',
                meta: {
                  scale: d3.scaleLog().domain([0, 1000]),
                  format: (n: number) => `${(n / 1000).toFixed(1)}k`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 250,
                      position: 0.4,
                    },
                    {
                      value: 500,
                      position: 0.6,
                    },
                    {
                      value: 750,
                      position: 0.8,
                    },
                    {
                      value: 1000,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 386,
                  playerId: 'peyton-manning',
                },
              },
              {
                id: 'touchdowns',
                name: 'Rushing TDs',
                meta: {
                  scale: d3.scaleLog().domain([0, 100]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 25,
                      position: 0.4,
                    },
                    {
                      value: 50,
                      position: 0.6,
                    },
                    {
                      value: 75,
                      position: 0.8,
                    },
                    {
                      value: 100,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 4,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'awards',
        name: 'Awards & Honors',
        subgroups: [
          {
            id: 'individual',
            name: 'Individual',
            columns: [
              {
                id: 'mvp',
                name: 'MVPs',
                meta: {
                  scale: d3.scaleLinear().domain([0, 10]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 2,
                      position: 0.4,
                    },
                    {
                      value: 4,
                      position: 0.6,
                    },
                    {
                      value: 6,
                      position: 0.8,
                    },
                    {
                      value: 8,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 3,
                  playerId: 'peyton-manning',
                },
              },
              {
                id: 'pro-bowl',
                name: 'Pro Bowls',
                meta: {
                  scale: d3.scaleLinear().domain([0, 20]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 5,
                      position: 0.4,
                    },
                    {
                      value: 10,
                      position: 0.6,
                    },
                    {
                      value: 15,
                      position: 0.8,
                    },
                    {
                      value: 20,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 9,
                  playerId: 'peyton-manning',
                },
              },
              {
                id: 'all-pro',
                name: 'All-Pros',
                meta: {
                  scale: d3.scaleLinear().domain([0, 10]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 2,
                      position: 0.4,
                    },
                    {
                      value: 4,
                      position: 0.6,
                    },
                    {
                      value: 6,
                      position: 0.8,
                    },
                    {
                      value: 8,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 3,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
          {
            id: 'team',
            name: 'Team',
            columns: [
              {
                id: 'sb-appearance',
                name: 'Super Bowl Appearances',
                meta: {
                  scale: d3.scaleLinear().domain([0, 10]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 2,
                      position: 0.4,
                    },
                    {
                      value: 4,
                      position: 0.6,
                    },
                    {
                      value: 6,
                      position: 0.8,
                    },
                    {
                      value: 8,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 1,
                  playerId: 'peyton-manning',
                },
              },
              {
                id: 'sb-win',
                name: 'Super Bowl Wins',
                meta: {
                  scale: d3.scaleLinear().domain([0, 10]),
                  format: (n: number) => `${n}`,
                  labels: [
                    {
                      value: 0,
                      position: 0.2,
                    },
                    {
                      value: 2,
                      position: 0.4,
                    },
                    {
                      value: 4,
                      position: 0.6,
                    },
                    {
                      value: 6,
                      position: 0.8,
                    },
                    {
                      value: 8,
                      position: 1,
                    },
                  ],
                },
                record: {
                  value: 1,
                  playerId: 'peyton-manning',
                },
              },
            ],
          },
        ],
      },
    ];

    return {
      statGroups,
    };
  },
  { persist: true }
);
