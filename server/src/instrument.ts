import * as Sentry from '@sentry/nestjs';

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/guides/nestjs/configuration/options/#tracesSampleRate
  tracesSampleRate: 1.0,
});
