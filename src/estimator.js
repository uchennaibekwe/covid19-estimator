const output = {
  data: {},
  impact: {},
  severeImpact: {}
};

// functions
const currentlyInfected = (reportedCases, impact) => reportedCases * impact;

const durationInDays = (periodType, timeToElapse) => {
  const duration = parseInt(timeToElapse, 10);
  const period = periodType.toLowerCase();
  switch (period) {
    case 'days':
      return duration;
    case 'weeks':
      return duration * 7;
    case 'months':
      return duration * 30;
    default:
      return null;
  }
};

const infectionsByRequestedTime = (infected, periodType, timeToElapse) => {
  const duration = (durationInDays(periodType, timeToElapse));
  return infected * (2 ** Math.trunc((duration / 3)));
};

const severeCasesByRequestedTime = (infectionsByReqTime) => Math.trunc(0.15 * infectionsByReqTime);
const availableHospitalBeds = (totalHospitalBeds) => 0.35 * totalHospitalBeds;

const casesForICUByRequestedTime = (infByRequestedTime) => Math.trunc(0.05 * infByRequestedTime);
const casesForVentilatorsByRequestedTime = (infByRequestedTime) => {
  const cases = (0.02 * infByRequestedTime);
  return Math.trunc(cases);
};
const dollarsInFlight = (infByReqT, pop, income, period) => {
  const dollars = (infByReqT * pop * income) / period;
  return Math.trunc(dollars);
};
// End functions

// main
const covid19ImpactEstimator = (data) => {
  // Challenge 1
  const impactInf = currentlyInfected(data.reportedCases, 10);
  const severeImpactInf = currentlyInfected(data.reportedCases, 50);

  const impInfByReqT = infectionsByRequestedTime(impactInf, data.periodType, data.timeToElapse);
  const severeImpInfByReqT = infectionsByRequestedTime(
    severeImpactInf,
    data.periodType,
    data.timeToElapse
  );

  // Challenge 2
  const impactSevereCasesByReqT = severeCasesByRequestedTime(impInfByReqT);
  const severeImpactSevereCasesByReqT = severeCasesByRequestedTime(severeImpInfByReqT);

  const availableBeds = availableHospitalBeds(data.totalHospitalBeds);
  const impactHospitalBeds = Math.trunc(availableBeds - impactSevereCasesByReqT);
  const severeImpactHospitalBeds = Math.trunc(availableBeds - severeImpactSevereCasesByReqT);

  // Challenge 3
  const impactCasesForICUByReqT = casesForICUByRequestedTime(impInfByReqT);
  const severeImpactCasesForICUByReqT = casesForICUByRequestedTime(severeImpInfByReqT);

  const impactCasesForVentilators = casesForVentilatorsByRequestedTime(impInfByReqT);
  const severeImpactCasesForVentilators = casesForVentilatorsByRequestedTime(severeImpInfByReqT);

  const impactDollarsInFlight = dollarsInFlight(
    impInfByReqT,
    data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD,
    durationInDays(data.periodType, data.timeToElapse)
  );

  const severeImpactDollarsInFlight = dollarsInFlight(
    severeImpInfByReqT,
    data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD,
    durationInDays(data.periodType, data.timeToElapse)
  );

  output.impact = {
    currentlyInfected: impactInf,
    infectionsByRequestedTime: impInfByReqT,
    severeCasesByRequestedTime: impactSevereCasesByReqT,
    hospitalBedsByRequestedTime: impactHospitalBeds,
    casesForICUByRequestedTime: impactCasesForICUByReqT,
    casesForVentilatorsByRequestedTime: impactCasesForVentilators,
    dollarsInFlight: impactDollarsInFlight
  };

  output.severeImpact = {
    currentlyInfected: severeImpactInf,
    infectionsByRequestedTime: severeImpInfByReqT,
    severeCasesByRequestedTime: severeImpactSevereCasesByReqT,
    hospitalBedsByRequestedTime: severeImpactHospitalBeds,
    casesForICUByRequestedTime: severeImpactCasesForICUByReqT,
    casesForVentilatorsByRequestedTime: severeImpactCasesForVentilators,
    dollarsInFlight: severeImpactDollarsInFlight
  };

  output.data = data;

  return output;
};

export default covid19ImpactEstimator;
