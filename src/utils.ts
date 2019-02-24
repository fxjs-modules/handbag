export function isProduction (env = process.env.FX_HANDBAG_ENV || process.env.NODE_ENV) {
    return env === 'production'
}