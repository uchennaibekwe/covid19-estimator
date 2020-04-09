const result = {
  data: {},
  impact: {},
  severeImpact: {}
};

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

const covid19ImpactEstimator = (data) => {
  const impactInf = currentlyInfected(data.reportedCases, 10);
  const sImpactInf = currentlyInfected(data.reportedCases, 50);

  const impInfByReqT = infectionsByRequestedTime(impactInf, data.periodType, data.timeToElapse);
  const sImpInfByReqT = infectionsByRequestedTime(sImpactInf, data.periodType, data.timeToElapse);

  result.impact.currentlyInfected = impactInf;
  result.severeImpact.currentlyInfected = sImpactInf;
  result.impact.infectionsByRequestedTime = impInfByReqT;
  result.severeImpact.infectionsByRequestedTime = sImpInfByReqT;

  result.data = data;

  return result;
};

export default covid19ImpactEstimator;
