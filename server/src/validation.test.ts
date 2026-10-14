import { test } from 'node:test'
import assert from 'node:assert/strict'
import { profileInput, preferencesInput } from './validation.js'
test('profile accepts SD, SMP and SMA and discards ownership fields', () => {
 for (const grade of ['SD', 'SMP', 'SMA']) assert.deepEqual(profileInput({ name: ' Dina ', grade, goal: 'Mengenal kata', user_id: 'other' }), { name: 'Dina', grade, goal: 'Mengenal kata' })
 for (const body of [null, { name: '', grade: 'SD' }, { name: 'Dina', grade: 'Kuliah', goal: 'Mengenal kata' }, { name: 'Dina', grade: ['SD'], goal: 'Mengenal kata' }]) assert.throws(() => profileInput(body))
})
test('preferences reject incomplete, unknown or invalid values', () => {
 const valid = { textSize: 'large', theme: 'dark', speed: '0.5', language: 'bisindo', comfortable: true, contrast: false, dataSaver: true }
 assert.deepEqual(preferencesInput(valid), valid)
 for (const body of [null, {}, { ...valid, theme: 'invalid' }, { ...valid, dataSaver: 'true' }, { ...valid, mastered: true }]) assert.throws(() => preferencesInput(body))
})
