export function isProduction () {
    return process.env.FX_HANDBAG_ENV === 'production' || process.env.NODE_ENV === 'production'
}