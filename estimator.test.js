import estimator from './src/estimator';

describe('Covid19 Estimator', () => {
  const input = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType: 'days',
    timeToElapse: 28,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  };

  test('contains the input data object', () => {
    expect(estimator(input)).toMatchObject({
      data: input
    });
  });

  test('compute impact data', () => {
    const currentlyInfected = input.reportedCases * 10;
    const infectionsByRequestedTime = Math.trunc(
      currentlyInfected * (2 ** Math.trunc(input.timeToElapse / 3))
    );
    const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
    const beds = Math.trunc(((0.35 * input.totalHospitalBeds) - severeCasesByRequestedTime));
    const hospitalBedsByRequestedTime = beds;
    const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
    const casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);
    const dollarsInFlight = Math.trunc(
      (infectionsByRequestedTime * input.region.avgDailyIncomePopulation
      * input.region.avgDailyIncomeInUSD) / input.timeToElapse
    );

    expect(estimator(input)).toMatchObject({
      impact: {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
      }
    });
  });

  test('compute severe impact data', () => {
    const currentlyInfected = input.reportedCases * 50;
    const infectionsByRequestedTime = Math.trunc(
      currentlyInfected * (2 ** Math.trunc(input.timeToElapse / 3))
    );
    const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
    const beds = Math.trunc(((0.35 * input.totalHospitalBeds) - severeCasesByRequestedTime));
    const hospitalBedsByRequestedTime = beds;
    const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
    const casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);
    const dollarsInFlight = Math.trunc(
      (infectionsByRequestedTime * input.region.avgDailyIncomePopulation
      * input.region.avgDailyIncomeInUSD) / input.timeToElapse
    );
    expect(estimator(input)).toMatchObject({
      severeImpact: {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
      }
    });
  });

  test('test for change in periodType to month', () => {
    input.periodType = 'months';
    input.timeToElapse = 1;
    expect(estimator(input)).toMatchObject({
      impact: {
        infectionsByRequestedTime: Math.trunc(6740 * (2 ** Math.trunc(30 / 3)))
      }
    });
  });

  test('test for change in periodType to weeks', () => {
    input.periodType = 'weeks';
    input.timeToElapse = 4;
    expect(estimator(input)).toMatchObject({
      impact: {
        infectionsByRequestedTime: Math.trunc(6740 * (2 ** Math.trunc(28 / 3)))
      }
    });
  });
});
