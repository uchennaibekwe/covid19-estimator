const output = {
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

const severeCasesByRequestedTime = (infectionsByReqTime) => 0.15 * infectionsByReqTime;
const availableHospitalBeds = (totalHospitalBeds) => 0.35 * totalHospitalBeds;

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

  output.data = data;

  return output;
};

export default covid19ImpactEstimator;
