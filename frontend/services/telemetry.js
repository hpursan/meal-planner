import { Platform } from 'react-native';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } from '@opentelemetry/semantic-conventions';
import * as Linking from 'expo-linking';

// -- Configuration --
const SERVICE_NAME = 'meal-planner-mobile';
const ENV = __DEV__ ? 'development' : 'production';

// Determine the Collector URL based on the environment
const getCollectorUrl = () => {
    if (Platform.OS === 'android') {
        // Android Emulator specific localhost
        return 'http://10.0.2.2:4318/v1/traces';
    } else if (Platform.OS === 'ios') {
        // iOS Simulator uses localhost
        return 'http://localhost:4318/v1/traces';
    }
    // Fallback or physical device (would need actual IP)
    return 'http://localhost:4318/v1/traces';
};

let tracerProvider = null;

export const initTelemetry = () => {
    if (tracerProvider) return; // Already initialized

    console.log('[Telemetry] Initializing...', getCollectorUrl());

    // 1. Create Provider with Resources
    tracerProvider = new WebTracerProvider({
        resource: new Resource({
            [SEMRESATTRS_SERVICE_NAME]: SERVICE_NAME,
            [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: ENV,
        }),
    });

    // 2. Configure Exporter (OTLP HTTP)
    const exporter = new OTLPTraceExporter({
        url: getCollectorUrl(), // e.g. http://localhost:4318/v1/traces
        headers: {}, // Optional headers
    });

    // 3. Add Processor (Batch for prod, Simple for dev debugging)
    // We use BatchSpanProcessor generally for performance, but Simple is good for immediate feedback in dev.
    // Let's use Batch with short timeout for now.
    tracerProvider.addSpanProcessor(new BatchSpanProcessor(exporter, {
        maxQueueSize: 100,
        scheduledDelayMillis: 5000,
    }));

    // Optional: Log to console in Dev
    if (__DEV__) {
        tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    }

    // 4. Register
    tracerProvider.register();

    // 5. Instrumentation (Auto-capture Fetch)
    registerInstrumentations({
        instrumentations: [
            new FetchInstrumentation({
                ignoreUrls: [/.*localhost:4318.*/], // Don't trace the trace exporter itself!
                clearTimingResources: true,
            }),
        ],
    });

    console.log('[Telemetry] Initialized.');
};

export const getTracer = (name = 'default') => {
    if (!tracerProvider) {
        // Fallback if accessed before init, though register() sets global
        return {
            startSpan: (name) => ({
                end: () => { },
                setAttribute: () => { },
                recordException: () => { },
                setStatus: () => { },
            }), // Dummy tracer
        };
    }
    return tracerProvider.getTracer(name);
};
