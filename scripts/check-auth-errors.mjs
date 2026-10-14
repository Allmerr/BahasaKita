import assert from 'node:assert/strict'
import { authErrorMessage } from '../src/authErrors.js'

assert.match(authErrorMessage({ code: 'email_address_not_authorized' }), /layanan email/)
assert.match(authErrorMessage({ code: 'over_email_send_rate_limit', status: 429 }), /pengiriman email/)
assert.match(authErrorMessage({ code: 'weak_password' }), /Kata sandi/)
assert.match(authErrorMessage({ code: 'email_not_confirmed' }, 'login'), /belum dikonfirmasi/)
assert.match(authErrorMessage({ name: 'AuthRetryableFetchError', status: 0 }), /koneksi internet/)
assert.match(authErrorMessage({ code: 'unexpected_failure', status: 500 }), /Kode: unexpected_failure/)
assert.match(authErrorMessage({ status: 503 }), /HTTP 503/)
assert.doesNotMatch(authErrorMessage({ code: '<script>private</script>', message: 'private token password', status: 400 }), /private|token|password|script/)
console.log('PASS: Auth errors give actionable messages without raw responses or credentials.')
