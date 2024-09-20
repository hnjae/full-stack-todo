export default {
  '*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}': ['eslint --fix', 'prettier --write'],
  '*.{css,html,json,yaml,md}': 'prettier --ignore-unknown --write',
};
