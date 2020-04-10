const output = {
  data: {},
  impact: {},
  severeImpact: {}
};

// functions
const currentlyInfected = (reportedCases, impact) => reportedCases * impact;

const durationInDays = (periodType, timeToElapse) => {
  const duration = parseInt(timeToElapse, 10);
  switch (periodType) {
    case 'days':
      return duration;
    case 'weeks':
      return duration * 7;
    case 'months':
      return duration * 28;
    default:
      return null;
  }
};

const infectionsByRequestedTime = (infected, periodType, timeToElapse) => {
  const duration = (durationInDays(periodType, timeToElapse));
  return infected * (2 ** (duration / 3));
};

const severeCasesByRequestedTime = (infectionsByReqTime) => 0.15 * infectionsByReqTime;
const availableHospitalBeds = (totalHospitalBeds) => 0.35 * totalHospitalBeds;

const casesForICUByRequestedTime = (infByRequestedTime) => 0.05 * infByRequestedTime;
const casesForVentilatorsByRequestedTime = (infByRequestedTime) => 0.02 * infByRequestedTime;
const dollarsInFlight = (infByReqT, pop, income, period) => (infByReqT * pop) * income * period;
// End functions

// main
const covid19ImpactEstimator = (data) => {
  const impactInf = currentlyInfected(data.reportedCases, 10);
  const sImpactInf = currentlyInfected(data.reportedCases, 50);

  const impInfByReqT = infectionsByRequestedTime(impactInf, data.periodType, data.timeToElapse);
  const sImpInfByReqT = infectionsByRequestedTime(sImpactInf, data.periodType, data.timeToElapse);

  output.impact.currentlyInfected = impactInf;
  output.severeImpact.currentlyInfected = sImpactInf;

  output.impact.infectionsByRequestedTime = impInfByReqT;
  output.severeImpact.infectionsByRequestedTime = sImpInfByReqT;

  // Challenge 2
  const impactSevereCasesByReqT = severeCasesByRequestedTime(impInfByReqT);
  const sImpactSevereCasesByReqT = severeCasesByRequestedTime(sImpInfByReqT);

  output.impact.severeCasesByRequestedTime = impactSevereCasesByReqT;
  output.severeImpact.severeCasesByRequestedTime = sImpactSevereCasesByReqT;

  const availableBeds = availableHospitalBeds(data.totalHospitalBeds);
  const impactHospitalBeds = Math.round(availableBeds - impactSevereCasesByReqT);
  const sImpactHospitalBeds = Math.round(availableBeds - sImpactSevereCasesByReqT);

  output.impact.hospitalBedsByRequestedTime = impactHospitalBeds;
  output.severeImpact.hospitalBedsByRequestedTime = sImpactHospitalBeds;

  // Challenge 3
  const impactCasesForICUByReqT = casesForICUByRequestedTime(impInfByReqT);
  const sImpactCasesForICUByReqT = casesForICUByRequestedTime(sImpInfByReqT);

  const impactCasesForVentilators = casesForVentilatorsByRequestedTime(impInfByReqT);
  const severeImpactCasesForVentilators = casesForVentilatorsByRequestedTime(sImpInfByReqT);

  const impactDollarsInFlight = dollarsInFlight(
    impInfByReqT,
    data.avgDailyIncomePopulation,
    data.avgDailyIncomeInUSD,
    durationInDays(data.periodType, data.timeToElapse)
  );

  const sImpactDollarsInFlight = dollarsInFlight(
    sImpInfByReqT,
    data.avgDailyIncomePopulation,
    data.avgDailyIncomeInUSD,
    durationInDays(data.periodType, data.timeToElapse)
  );

  output.impact.casesForICUByRequestedTime = impactCasesForICUByReqT;
  output.severeImpact.casesForICUByRequestedTime = sImpactCasesForICUByReqT;

  output.impact.casesForVentilatorsByRequestedTime = impactCasesForVentilators;
  output.severeImpact.casesForVentilatorsByRequestedTime = severeImpactCasesForVentilators;

  output.impact.dollarsInFlight = impactDollarsInFlight;
  output.severeImpact.dollarsInFlight = sImpactDollarsInFlight;

  output.data = data;

  return output;
};

export default covid19ImpactEstimator;
