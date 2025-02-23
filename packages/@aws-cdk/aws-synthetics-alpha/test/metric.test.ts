import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Stack } from 'aws-cdk-lib';
import * as synthetics from '../lib';

testDeprecated('.metricXxx() methods can be used to obtain Metrics for the canary', () => {
  // GIVEN
  const stack = new Stack(new App(), 'canaries');

  const canary = new synthetics.Canary(stack, 'mycanary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
  });

  // WHEN
  const metricSuccess = canary.metricSuccessPercent();
  const metricFailed = canary.metricFailed();
  const metricDuration = canary.metricDuration();

  // THEN
  expect(metricSuccess).toEqual(expect.objectContaining({
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'SuccessPercent',
    statistic: 'Average',
  }));

  expect(metricFailed).toEqual(expect.objectContaining({
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Failed',
    statistic: 'Sum',
  }));

  expect(metricDuration).toEqual(expect.objectContaining({
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Duration',
    statistic: 'Average',
  }));
});

testDeprecated('Metric can specify statistic', () => {
  // GIVEN
  const stack = new Stack(new App(), 'canaries');

  const canary = new synthetics.Canary(stack, 'mycanary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
  });

  // WHEN
  const metric = canary.metricFailed({ statistic: 'Sum' });

  // THEN
  expect(metric).toEqual(expect.objectContaining({
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Failed',
    statistic: 'Sum',
  }));
});
