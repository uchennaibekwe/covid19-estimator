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
    expect(estimator(input)).toMatchObject({
      impact: {
        currentlyInfected: 6740,
        infectionsByRequestedTime: 6740 * (2 ** (28 / 3))
      }
    });
  });

  test('compute severe Impact data', () => {
    expect(estimator(input)).toMatchObject({
      severeImpact: {
        currentlyInfected: 33700,
        infectionsByRequestedTime: 33700 * (2 ** (28 / 3))
      }
    });
  });

  test('test for change in periodType to month', () => {
    input.periodType = 'months';
    input.timeToElapse = 1;
    expect(estimator(input)).toMatchObject({
      impact: {
        infectionsByRequestedTime: 6740 * (2 ** (28 / 3))
      }
    });
  });

  test('test for change in periodType to weeks', () => {
    input.periodType = 'weeks';
    input.timeToElapse = 4;
    expect(estimator(input)).toMatchObject({
      impact: {
        infectionsByRequestedTime: 6740 * (2 ** (28 / 3))
      }
    });
  });
});
