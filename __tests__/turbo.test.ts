import * as fs from 'fs';
test('turbo config exists', () => {
  expect(fs.existsSync('turbo.json')).toBe(true);
});
