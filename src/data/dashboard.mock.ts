export const adminDashboardMock = {
  stats: {
    totalCompanies: 128,
    activeCompanies: 96,
    totalCampaigns: 842,
    creditsConsumed: 184500,
    messagesSent: 356200,
    averageResponseRate: 42,
  },

  campaignsByMonth: [
    { month: "Jan", campaigns: 42, responses: 1200 },
    { month: "Fév", campaigns: 58, responses: 1800 },
    { month: "Mar", campaigns: 74, responses: 2600 },
    { month: "Avr", campaigns: 91, responses: 3200 },
    { month: "Mai", campaigns: 116, responses: 4100 },
  ],

  companiesByStatus: [
    { name: "Actives", value: 96 },
    { name: "En attente", value: 18 },
    { name: "Suspendues", value: 9 },
    { name: "Désactivées", value: 5 },
  ],

  topCompanies: [
    { name: "Pharma Plus", credits: 42000 },
    { name: "Market CI", credits: 31800 },
    { name: "Retail Hub", credits: 27600 },
    { name: "Santé Express", credits: 21400 },
  ],
};

export const companyDashboardMock = {
  stats: {
    contacts: 12450,
    activeCampaigns: 4,
    creditsBalance: 8200,
    responseRate: 38,
    messagesSent: 24500,
    answersCollected: 9310,
  },

  responsesByDay: [
    { day: "Lun", responses: 240 },
    { day: "Mar", responses: 310 },
    { day: "Mer", responses: 420 },
    { day: "Jeu", responses: 380 },
    { day: "Ven", responses: 510 },
    { day: "Sam", responses: 290 },
    { day: "Dim", responses: 180 },
  ],

  contactsBySource: [
    { name: "Manuel", value: 3200 },
    { name: "Import", value: 6100 },
    { name: "API", value: 2500 },
    { name: "WhatsApp Opt-in", value: 650 },
  ],

  campaignPerformance: [
    { name: "Satisfaction", sent: 5000, responses: 2100 },
    { name: "NPS", sent: 3200, responses: 960 },
    { name: "Prix", sent: 2200, responses: 1100 },
    { name: "Feedback", sent: 4100, responses: 1850 },
  ],
};